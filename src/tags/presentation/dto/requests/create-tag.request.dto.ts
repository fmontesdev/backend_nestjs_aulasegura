import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { TagType } from '../../../domain/enums/tag-type.enum';

export class CreateTagRequest {
  @ApiProperty({ description: 'Tipo de tag', enum: TagType, example: TagType.RFID })
  @IsEnum(TagType, { message: `Type must be one of: ${Object.values(TagType).join(', ')}` })
  type!: TagType;

  @ApiProperty({ 
    description: 'Identificador único del chip RFID (hexadecimal). Requerido solo para RFID', 
    example: '04AABBCCDD22',
    required: false 
  })
  @IsString()
  @IsOptional()
  @Matches(/^[0-9A-Fa-f]+$/, { message: 'rawUid must be a valid hexadecimal string' })
  rawUid?: string;
}
