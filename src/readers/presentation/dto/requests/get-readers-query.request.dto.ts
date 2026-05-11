import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetReadersQueryRequest {
  @ApiPropertyOptional({ description: 'Número de página (comienza en 1)', default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Número de lectores por página', default: 10, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filtros combinados. Formato: texto,campo:valor. Campos: room, active.',
    example: 'reader-01,room:A101,active:true',
  })
  @IsString()
  @IsOptional()
  filters?: string;
}
