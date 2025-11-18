import { AccessMethod } from '../../domain/enums/access-method.enum';

export interface QrAccessCheckDto {
  readerCode: string;
  accessMethod: AccessMethod;
}
