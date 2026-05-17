import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '../../../domain/entities/tag.entity';
import { TagRepository } from '../../../domain/repositories/tag.repository';
import { FindTagsFiltersDto, PaginatedResult } from '../../../application/dto/find-tags-filters.dto';

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

  async findAllWithFilters(filters: FindTagsFiltersDto): Promise<PaginatedResult<TagEntity>> {
    const { page, limit, globalSearch, type, user, email, isActive } = filters;
    const query = this.repository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.user', 'user')
      .where('tag.isActive = :isActive', { isActive: isActive ?? true });

    if (globalSearch && globalSearch.length > 0) {
      const globalConditions: string[] = [];
      const globalParams: Record<string, string> = {};

      globalSearch.forEach((term, index) => {
        const paramName = `global${index}`;
        globalParams[paramName] = `%${term}%`;
        globalConditions.push(`(
          LOWER(tag.type) LIKE LOWER(:${paramName}) OR
          LOWER(user.name) LIKE LOWER(:${paramName}) OR
          LOWER(user.lastname) LIKE LOWER(:${paramName}) OR
          LOWER(user.email) LIKE LOWER(:${paramName})
        )`);
      });

      query.andWhere(`(${globalConditions.join(' AND ')})`, globalParams);
    }

    if (type) {
      query.andWhere('tag.type = :type', { type });
    }

    if (user) {
      query.andWhere(
        `(
          LOWER(user.name) LIKE LOWER(:user) OR
          LOWER(user.lastname) LIKE LOWER(:user) OR
          LOWER(user.email) LIKE LOWER(:user)
        )`,
        { user: `%${user}%` },
      );
    }

    if (email) {
      query.andWhere('LOWER(user.email) LIKE LOWER(:email)', { email: `%${email}%` });
    }

    const offset = (page - 1) * limit;
    const [data, total] = await query
      .orderBy('tag.issuedAt', 'DESC')
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
