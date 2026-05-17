import { TagEntity } from '../../domain/entities/tag.entity';

export interface CreateTagResultDto {
  tag: TagEntity;
  mobileCredential?: string;
}
