import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLogEntity } from '../../../domain/entities/access-log.entity';
import { AccessLogRepository } from '../../../domain/repositories/access-log.repository';
import { AccessLogDateFilter, FindAccessLogFiltersDto, PaginatedResult } from '../../../application/dto/find-access-log-filters.dto';
import { getMadridDayRange, getMadridMonthRange, getMadridWeekRange } from 'src/common/utils/madrid-timezone.util';
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
