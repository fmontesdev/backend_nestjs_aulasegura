import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, MaxLength } from 'class-validator';

export class UpdateReaderRequest {
  @ApiPropertyOptional({ description: 'Código único del lector', example: 'READER-A101', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  readerCode?: string;

  @ApiPropertyOptional({ description: 'ID del aula asignada a este lector', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  roomId?: number;
}
