import { TagEntity } from '../../domain/entities/tag.entity';
import { TagResponse } from '../dto/responses/tag.response.dto';
import { UserMapper } from '../../../users/presentation/mappers/user.mapper';
import { PaginatedResult } from '../../application/dto/find-tags-filters.dto';
import { PaginatedTagsResponse, PaginationMeta } from '../dto/responses/paginated-tags.response.dto';

export class TagMapper {
  static toResponse(entity: TagEntity, mobileCredential?: string): TagResponse {
    return {
      tagId: entity.tagId,
      type: entity.type,
      issuedAt: entity.issuedAt,
      isActive: entity.isActive,
      user: UserMapper.toResponse(entity.user),
      ...(mobileCredential ? { mobileCredential } : {}),
    };
  }

  static toResponseList(entities: TagEntity[]): TagResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }

  static toPaginationMeta(result: PaginatedResult<TagEntity>): PaginationMeta {
    return {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasPrevious: result.page > 1,
      hasNext: result.page < result.totalPages,
    };
  }

  static toPaginatedResponse(result: PaginatedResult<TagEntity>): PaginatedTagsResponse {
    return {
      data: this.toResponseList(result.data),
      meta: this.toPaginationMeta(result),
    };
  }
}
