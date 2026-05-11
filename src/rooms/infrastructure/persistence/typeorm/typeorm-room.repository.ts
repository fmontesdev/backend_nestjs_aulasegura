import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../../../domain/entities/room.entity';
import { RoomRepository } from '../../../domain/repositories/room.repository';
import { FindRoomsFiltersDto, PaginatedResult } from '../../../application/dto/find-rooms-filters.dto';
import { PermissionEntity } from '../../../../permissions/domain/entities/permission.entity';
import { AccessLogEntity } from '../../../../access/domain/entities/access-log.entity';
import { ReaderEntity } from '../../../../readers/domain/entities/reader.entity';

@Injectable()
export class TypeOrmRoomRepository implements RoomRepository {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly repository: Repository<RoomEntity>,
  ) {}

  async findAll(): Promise<RoomEntity[]> {
    return this.repository.find({
      relations: ['course', 'readers'],
      order: { roomId: 'ASC' },
    });
  }

  async findAllWithFilters(filters: FindRoomsFiltersDto): Promise<PaginatedResult<RoomEntity>> {
    const { page, limit, globalSearch, name, building, floor, course } = filters;
    const query = this.repository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.course', 'course')
      .leftJoinAndSelect('room.readers', 'readers');

    if (globalSearch && globalSearch.length > 0) {
      const globalConditions: string[] = [];
      const globalParams: Record<string, string> = {};

      globalSearch.forEach((term, index) => {
        const paramName = `global${index}`;
        globalParams[paramName] = `%${term}%`;
        globalConditions.push(`(
          LOWER(room.roomCode) LIKE LOWER(:${paramName}) OR
          LOWER(room.name) LIKE LOWER(:${paramName})
        )`);
      });

      query.andWhere(`(${globalConditions.join(' AND ')})`, globalParams);
    }

    if (name) {
      query.andWhere(
        `(
          LOWER(room.roomCode) LIKE LOWER(:name) OR
          LOWER(room.name) LIKE LOWER(:name)
        )`,
        { name: `%${name}%` },
      );
    }

    if (building !== undefined) {
      query.andWhere('room.building = :building', { building });
    }

    if (floor !== undefined) {
      query.andWhere('room.floor = :floor', { floor });
    }

    if (course) {
      const courseId = Number(course);
      query.andWhere(
        `(
          LOWER(course.name) LIKE LOWER(:course) OR
          LOWER(course.courseCode) LIKE LOWER(:course)${Number.isInteger(courseId) ? ' OR room.courseId = :courseId' : ''}
        )`,
        Number.isInteger(courseId) ? { course: `%${course}%`, courseId } : { course: `%${course}%` },
      );
    }

    const offset = (page - 1) * limit;
    const [data, total] = await query
      .orderBy('room.roomId', 'ASC')
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

  async findOneById(roomId: number): Promise<RoomEntity | null> {
    return this.repository.findOne({
      where: { roomId },
      relations: ['course', 'readers'],
    });
  }

  async findOneByRoomCode(roomCode: string): Promise<RoomEntity | null> {
    return this.repository.findOne({
      where: { roomCode },
    });
  }

  async hasPermissions(roomId: number): Promise<boolean> {
    return this.repository.manager.exists(PermissionEntity, {
      where: { roomId },
    });
  }

  async hasAccessLogs(roomId: number): Promise<boolean> {
    return this.repository.manager.exists(AccessLogEntity, {
      where: { roomId },
    });
  }

  async detachReaders(roomId: number): Promise<void> {
    await this.repository.manager.update(ReaderEntity, { roomId }, { roomId: null });
  }

  async save(room: RoomEntity): Promise<RoomEntity> {
    return this.repository.save(room);
  }

  async delete(roomId: number): Promise<void> {
    await this.repository.delete(roomId);
  }
}
