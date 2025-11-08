import { TagEntity } from '../../domain/entities/tag.entity';
import { TagResponse } from '../dto/responses/tag.response.dto';
import { UserMapper } from '../../../users/presentation/mappers/user.mapper';

export class TagMapper {
  static toResponse(entity: TagEntity): TagResponse {
    return {
      tagId: entity.tagId,
      tagCode: entity.tagCode,
      type: entity.type,
      issuedAt: entity.issuedAt,
      isActive: entity.isActive,
      user: UserMapper.toResponse(entity.user),
    };
  }

  static toResponseList(entities: TagEntity[]): TagResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
