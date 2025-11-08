import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '../../../domain/entities/tag.entity';
import { TagRepository } from '../../../domain/repositories/tag.repository';

@Injectable()
export class TypeOrmTagRepository implements TagRepository {
  constructor(
    @InjectRepository(TagEntity)
    private readonly repository: Repository<TagEntity>,
  ) {}

  async findAll(): Promise<TagEntity[]> {
    return this.repository.find({
      where: { isActive: true },
      relations: ['user'],
      order: { issuedAt: 'DESC' },
    });
  }

  async findOneById(tagId: number): Promise<TagEntity | null> {
    return this.repository.findOne({
      where: { tagId },
      relations: ['user'],
    });
  }

  async findOneActiveById(tagId: number): Promise<TagEntity | null> {
    return this.repository.findOne({
      where: { tagId, isActive: true },
      relations: ['user'],
    });
  }

  async findOneByTagCode(tagCode: string): Promise<TagEntity | null> {
    return this.repository.findOne({
      where: { tagCode },
      relations: ['user'],
    });
  }

  async save(tag: TagEntity): Promise<TagEntity> {
    return this.repository.save(tag);
  }
}
