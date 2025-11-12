import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLogEntity } from '../../../domain/entities/access-log.entity';
import { AccessLogRepository } from '../../../domain/repositories/access-log.repository';

@Injectable()
export class TypeOrmAccessLogRepository implements AccessLogRepository {
  constructor(
    @InjectRepository(AccessLogEntity)
    private readonly repository: Repository<AccessLogEntity>,
  ) {}

  async findAll(): Promise<AccessLogEntity[]> {
    return this.repository.find({
      relations: ['tag', 'user', 'reader', 'room', 'subject'],
      order: { createdAt: 'DESC' },
    });
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
