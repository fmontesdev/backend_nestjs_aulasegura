import { TagEntity } from '../entities/tag.entity';

export abstract class TagRepository {
  abstract findAll(): Promise<TagEntity[]>;
  abstract findOneById(tagId: number): Promise<TagEntity | null>;
  abstract findOneActiveById(tagId: number): Promise<TagEntity | null>;
  abstract findOneByTagCode(tagCode: string): Promise<TagEntity | null>;
  abstract save(tag: TagEntity): Promise<TagEntity>;
}
