import { AccessMethod } from '../../domain/enums/access-method.enum';

export interface CheckAccessDto {
  rawUid?: string; // Para RFID/NFC
  readerCode: string;
  accessMethod: AccessMethod;
}
