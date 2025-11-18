import { AccessMethod } from '../../domain/enums/access-method.enum';
import { AccessStatus } from '../../domain/enums/access-status.enum';

export interface CreateAccessLogDto {
  tagId?: number | null;
  userId: string;
  readerId: number;
  roomId: number;
  subjectId?: number | null;
  accessMethod: AccessMethod;
  accessStatus: AccessStatus;
}
