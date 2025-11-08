import { TagType } from '../../domain/enums/tag-type.enum';

export interface CreateTagDto {
  userId: string;
  type: TagType;
  rawUid?: string; // Solo para RFID
}
