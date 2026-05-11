import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReaderEntity } from '../../../domain/entities/reader.entity';
import { ReaderRepository } from '../../../domain/repositories/reader.repository';
import { FindReadersFiltersDto, PaginatedResult } from '../../../application/dto/find-readers-filters.dto';

@Injectable()
export class TypeOrmReaderRepository implements ReaderRepository {
  constructor(
    @InjectRepository(ReaderEntity)
    private readonly repository: Repository<ReaderEntity>,
  ) {}

  async findAll(): Promise<ReaderEntity[]> {
    return this.repository.find({
      where: { isActive: true },
      relations: ['room'],
      order: { readerId: 'ASC' },
    });
  }

  async findAllWithFilters(filters: FindReadersFiltersDto): Promise<PaginatedResult<ReaderEntity>> {
    const { page, limit, globalSearch, code, room, isActive } = filters;
    const query = this.repository
      .createQueryBuilder('reader')
      .leftJoinAndSelect('reader.room', 'room')
      .where('reader.isActive = :isActive', { isActive: isActive ?? true });

    if (globalSearch && globalSearch.length > 0) {
      const globalConditions: string[] = [];
      const globalParams: Record<string, string> = {};

      globalSearch.forEach((term, index) => {
        const paramName = `global${index}`;
        globalParams[paramName] = `%${term}%`;
        globalConditions.push(`LOWER(reader.readerCode) LIKE LOWER(:${paramName})`);
      });

      query.andWhere(`(${globalConditions.join(' AND ')})`, globalParams);
    }

    if (code) {
      query.andWhere('LOWER(reader.readerCode) LIKE LOWER(:code)', { code: `%${code}%` });
    }

    if (room) {
      const roomId = Number(room);
      query.andWhere(
        `(
          LOWER(room.roomCode) LIKE LOWER(:room) OR
          LOWER(room.name) LIKE LOWER(:room)${Number.isInteger(roomId) ? ' OR reader.roomId = :roomId' : ''}
        )`,
        Number.isInteger(roomId) ? { room: `%${room}%`, roomId } : { room: `%${room}%` },
      );
    }

    const offset = (page - 1) * limit;
    const [data, total] = await query
      .orderBy('reader.readerId', 'ASC')
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

  async findOneById(readerId: number): Promise<ReaderEntity | null> {
    return this.repository.findOne({
      where: { readerId },
      relations: ['room'],
    });
  }

  async findOneActiveById(readerId: number): Promise<ReaderEntity | null> {
    return this.repository.findOne({
      where: { readerId, isActive: true },
      relations: ['room'],
    });
  }

  async findOneByReaderCode(readerCode: string): Promise<ReaderEntity | null> {
    return this.repository.findOne({
      where: { readerCode },
    });
  }

  async save(reader: ReaderEntity): Promise<ReaderEntity> {
    return this.repository.save(reader);
  }
}
