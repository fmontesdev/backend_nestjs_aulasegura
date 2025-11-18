import { AccessMethod } from '../../domain/enums/access-method.enum';

export interface RfidNfcAccessCheckDto {
  rawUid?: string; // Para RFID/NFC
  readerCode: string;
  accessMethod: AccessMethod;
}
