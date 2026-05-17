import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { TagType } from '../../../domain/enums/tag-type.enum';

export class CreateAdminTagRequest {
  @ApiProperty({ description: 'ID del usuario propietario de la credencial', example: '1a1fcf19-6cbc-4d30-be9f-59f337c633a5' })
  @IsUUID()
  userId!: string;

  @ApiProperty({ description: 'Tipo de credencial', enum: TagType, example: TagType.RFID })
  @IsEnum(TagType, { message: `Type must be one of: ${Object.values(TagType).join(', ')}` })
  type!: TagType;

  @ApiPropertyOptional({ description: 'UID físico RFID/NFC. Requerido solo para RFID', example: '04AABBCCDD22' })
  @IsString()
  @IsOptional()
  @Matches(/^[0-9A-Fa-f]+$/, { message: 'rawUid must be a valid hexadecimal string' })
  rawUid?: string;
}
