import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsUUID } from 'class-validator';
import { AccessMethod } from '../../../domain/enums/access-method.enum';

export class QrAccessCheckRequest {
  @ApiProperty({ description: 'Código del lector', example: 'READER-001' })
  @IsString()
  readerCode!: string;

  @ApiProperty({ description: 'Método de acceso', enum: AccessMethod, example: AccessMethod.RFID })
  @IsEnum(AccessMethod)
  accessMethod!: AccessMethod;
}
