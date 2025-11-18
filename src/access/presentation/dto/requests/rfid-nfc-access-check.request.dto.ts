import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, Matches } from 'class-validator';
import { AccessMethod } from '../../../domain/enums/access-method.enum';

export class RfidNfcAccessCheckRequest {
  @ApiProperty({ description: 'UID de la tarjeta RFID/NFC', example: '04AABBCCDDEE11' })
  @IsString()
  @Matches(/^[0-9A-Fa-f]+$/, { message: 'rawUid must be a valid hexadecimal string' })
  rawUid?: string;

  @ApiProperty({ description: 'Código del lector', example: 'READER-001' })
  @IsString()
  readerCode!: string;

  @ApiProperty({ description: 'Método de acceso', enum: AccessMethod, example: AccessMethod.RFID })
  @IsEnum(AccessMethod)
  accessMethod!: AccessMethod;
}
