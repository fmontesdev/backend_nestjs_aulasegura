import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReaderEntity } from '../../../domain/entities/reader.entity';
import { ReaderRepository } from '../../../domain/repositories/reader.repository';

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
