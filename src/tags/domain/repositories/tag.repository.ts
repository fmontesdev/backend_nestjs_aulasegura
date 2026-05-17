import { TagEntity } from '../entities/tag.entity';
import { FindTagsFiltersDto, PaginatedResult } from '../../application/dto/find-tags-filters.dto';

export abstract class TagRepository {
  abstract findAll(): Promise<TagEntity[]>;
  abstract findAllWithFilters(filters: FindTagsFiltersDto): Promise<PaginatedResult<TagEntity>>;
  abstract findOneById(tagId: number): Promise<TagEntity | null>;
  abstract findOneActiveById(tagId: number): Promise<TagEntity | null>;
  abstract findOneByTagCode(tagCode: string): Promise<TagEntity | null>;
  abstract save(tag: TagEntity): Promise<TagEntity>;
}
