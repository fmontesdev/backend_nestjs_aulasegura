import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLogEntity } from '../../../domain/entities/access-log.entity';
import { AccessLogRepository } from '../../../domain/repositories/access-log.repository';
import {
  AccessAnalyticsDateFilter,
  AccessAnalyticsSummaryDto,
  HourlyActivityDto,
  TopDeniedRoomDto,
  TopDeniedUserDto,
} from '../../../application/dto/access-analytics-summary.dto';
import { AccessLogDateFilter, FindAccessLogFiltersDto, PaginatedResult } from '../../../application/dto/find-access-log-filters.dto';
import { getMadridDayRange, getMadridHour, getMadridMonthRange, getMadridWeekRange } from 'src/common/utils/madrid-timezone.util';
import { AccessStatus } from '../../../domain/enums/access-status.enum';

const spanishAccessStatusMapping: Record<string, AccessStatus> = {
  permitido: AccessStatus.ALLOWED,
  denegado: AccessStatus.DENIED,
  salida: AccessStatus.EXIT,
  'tiempo agotado': AccessStatus.TIMEOUT,
};

@Injectable()
export class TypeOrmAccessLogRepository implements AccessLogRepository {
  constructor(
    @InjectRepository(AccessLogEntity)
    private readonly repository: Repository<AccessLogEntity>,
  ) {}

  async findAll(filters: FindAccessLogFiltersDto): Promise<PaginatedResult<AccessLogEntity>> {
    const { page, limit, globalSearch, user, accessMethod, dateFilter, room, accessStatus } = filters;
    const query = this.repository
      .createQueryBuilder('accessLog')
      .leftJoinAndSelect('accessLog.tag', 'tag')
      .leftJoinAndSelect('accessLog.user', 'user')
      .leftJoinAndSelect('accessLog.reader', 'reader')
      .leftJoinAndSelect('accessLog.room', 'room')
      .leftJoinAndSelect('accessLog.subject', 'subject');

    if (globalSearch && globalSearch.length > 0) {
      const globalConditions: string[] = [];
      const globalParams: Record<string, string> = {};

      globalSearch.forEach((term, index) => {
        const paramName = `global${index}`;
        const statusParamName = `globalStatus${index}`;
        const translatedStatus = spanishAccessStatusMapping[term.toLowerCase()];
        globalParams[paramName] = `%${term}%`;
        if (translatedStatus) {
          globalParams[statusParamName] = translatedStatus;
        }
        globalConditions.push(`(
          LOWER(user.name) LIKE LOWER(:${paramName}) OR
          LOWER(user.lastname) LIKE LOWER(:${paramName}) OR
          LOWER(user.email) LIKE LOWER(:${paramName}) OR
          LOWER(room.name) LIKE LOWER(:${paramName}) OR
          LOWER(room.roomCode) LIKE LOWER(:${paramName}) OR
          LOWER(accessLog.accessMethod) LIKE LOWER(:${paramName}) OR
          LOWER(accessLog.accessStatus) LIKE LOWER(:${paramName})${translatedStatus ? ` OR
          accessLog.accessStatus = :${statusParamName}` : ''}
        )`);
      });

      query.andWhere(`(${globalConditions.join(' AND ')})`, globalParams);
    }

    if (user) {
      query.andWhere(
        '(LOWER(user.name) LIKE LOWER(:user) OR LOWER(user.lastname) LIKE LOWER(:user) OR LOWER(user.email) LIKE LOWER(:user))',
        { user: `%${user}%` },
      );
    }

    if (accessMethod) {
      query.andWhere('accessLog.accessMethod = :accessMethod', { accessMethod });
    }

    if (dateFilter && dateFilter !== AccessLogDateFilter.ALL) {
      const range = this.getDateRange(dateFilter);
      query.andWhere('accessLog.createdAt >= :startDate AND accessLog.createdAt < :endDate', {
        startDate: range.start,
        endDate: range.end,
      });
    }

    if (room) {
      query.andWhere(
        '(LOWER(room.name) LIKE LOWER(:room) OR LOWER(room.roomCode) LIKE LOWER(:room))',
        { room: `%${room}%` },
      );
    }

    if (accessStatus) {
      query.andWhere('accessLog.accessStatus = :accessStatus', { accessStatus });
    }

    const offset = (page - 1) * limit;
    const [data, total] = await query
      .orderBy('accessLog.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAnalyticsSummary(dateFilter: AccessAnalyticsDateFilter, limit: number): Promise<AccessAnalyticsSummaryDto> {
    const range = this.getAnalyticsDateRange(dateFilter);
    const logs = await this.repository
      .createQueryBuilder('accessLog')
      .leftJoinAndSelect('accessLog.user', 'user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('accessLog.room', 'room')
      .where('accessLog.createdAt >= :startDate AND accessLog.createdAt < :endDate', {
        startDate: range.start,
        endDate: range.end,
      })
      .getMany();

    return this.buildAnalyticsSummary(logs, limit);
  }

  private getDateRange(dateFilter: AccessLogDateFilter): { start: Date; end: Date } {
    switch (dateFilter) {
      case AccessLogDateFilter.TODAY:
        return getMadridDayRange();
      case AccessLogDateFilter.WEEK:
        return getMadridWeekRange();
      case AccessLogDateFilter.MONTH:
        return getMadridMonthRange();
      default:
        return getMadridDayRange();
    }
  }

  private getAnalyticsDateRange(dateFilter: AccessAnalyticsDateFilter): { start: Date; end: Date } {
    switch (dateFilter) {
      case AccessAnalyticsDateFilter.TODAY:
        return getMadridDayRange();
      case AccessAnalyticsDateFilter.WEEK:
        return getMadridWeekRange();
      case AccessAnalyticsDateFilter.MONTH:
        return getMadridMonthRange();
      default:
        return getMadridDayRange();
    }
  }

  private buildAnalyticsSummary(logs: AccessLogEntity[], limit: number): AccessAnalyticsSummaryDto {
    const totalAccesses = logs.length;
    const allowedAccesses = logs.filter((log) => log.accessStatus === AccessStatus.ALLOWED).length;
    const deniedLogs = logs.filter((log) => log.accessStatus === AccessStatus.DENIED);
    const deniedAccesses = deniedLogs.length;
    const denialRate = totalAccesses === 0 ? 0 : Math.round((deniedAccesses / totalAccesses) * 1000) / 10;

    return {
      kpis: {
        totalAccesses,
        allowedAccesses,
        deniedAccesses,
        denialRate,
      },
      topDeniedRooms: this.buildTopDeniedRooms(deniedLogs, limit),
      topDeniedUsers: this.buildTopDeniedUsers(deniedLogs, limit),
      hourlyActivity: this.buildHourlyActivity(logs),
    };
  }

  private buildTopDeniedRooms(deniedLogs: AccessLogEntity[], limit: number): TopDeniedRoomDto[] {
    const rooms = new Map<number, TopDeniedRoomDto>();

    deniedLogs.forEach((log) => {
      if (!log.room) return;

      const current = rooms.get(log.room.roomId);
      if (current) {
        current.deniedCount += 1;
        return;
      }

      rooms.set(log.room.roomId, {
        roomId: log.room.roomId,
        roomCode: log.room.roomCode,
        roomName: log.room.name,
        building: log.room.building,
        floor: log.room.floor,
        deniedCount: 1,
      });
    });

    return [...rooms.values()]
      .sort((a, b) => b.deniedCount - a.deniedCount || a.roomId - b.roomId)
      .slice(0, limit);
  }

  private buildTopDeniedUsers(deniedLogs: AccessLogEntity[], limit: number): TopDeniedUserDto[] {
    const users = new Map<string, TopDeniedUserDto>();

    deniedLogs.forEach((log) => {
      if (!log.user) return;

      const current = users.get(log.user.userId);
      if (current) {
        current.deniedCount += 1;
        return;
      }

      users.set(log.user.userId, {
        userId: log.user.userId,
        name: log.user.name,
        lastname: log.user.lastname,
        email: log.user.email,
        avatar: log.user.avatar ?? null,
        roles: log.user.roles?.map((role) => role.name) ?? [],
        deniedCount: 1,
      });
    });

    return [...users.values()]
      .sort((a, b) => b.deniedCount - a.deniedCount || a.userId.localeCompare(b.userId))
      .slice(0, limit);
  }

  private buildHourlyActivity(logs: AccessLogEntity[]): HourlyActivityDto[] {
    const activity = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      total: 0,
      allowed: 0,
      denied: 0,
      timeout: 0,
      exit: 0,
    }));

    logs.forEach((log) => {
      const hour = getMadridHour(log.createdAt);
      const bucket = activity[hour];
      bucket.total += 1;

      if (log.accessStatus === AccessStatus.ALLOWED) {
        bucket.allowed += 1;
      }

      if (log.accessStatus === AccessStatus.DENIED) {
        bucket.denied += 1;
      }

      if (log.accessStatus === AccessStatus.TIMEOUT) {
        bucket.timeout += 1;
      }

      if (log.accessStatus === AccessStatus.EXIT) {
        bucket.exit += 1;
      }
    });

    return activity;
  }

  async findOneById(accessLogId: number): Promise<AccessLogEntity | null> {
    return this.repository.findOne({
      where: { accessLogId },
      relations: ['tag', 'user', 'reader', 'room', 'subject'],
    });
  }

  async save(accessLog: AccessLogEntity): Promise<AccessLogEntity> {
    return this.repository.save(accessLog);
  }
}
