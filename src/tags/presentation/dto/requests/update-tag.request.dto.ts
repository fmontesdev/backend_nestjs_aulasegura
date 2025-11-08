import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { TagType } from '../../../domain/enums/tag-type.enum';

export class UpdateTagRequest {
  @ApiProperty({ 
    description: 'Identificador único del chip RFID (hexadecimal). Requerido si se cambia a tipo RFID', 
    example: '04AABBCCDD22',
    required: false 
  })
  @IsString()
  @IsOptional()
  @Matches(/^[0-9A-Fa-f]+$/, { message: 'rawUid must be a valid hexadecimal string' })
  rawUid?: string;
}
