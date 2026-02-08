import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetSubjectsQueryRequest {
  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Número de resultados por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filtros de búsqueda (términos globales o específicos separados por comas)',
    examples: {
      globalSearch: {
        summary: 'Búsqueda global',
        value: 'matemáticas',
      },
      specificCode: {
        summary: 'Filtro por código',
        value: 'code:MATH',
      },
      specificName: {
        summary: 'Filtro por nombre',
        value: 'name:física',
      },
      statusActive: {
        summary: 'Solo activas',
        value: 'activo',
      },
      statusInactive: {
        summary: 'Solo inactivas',
        value: 'inactivo',
      },
      department: {
        summary: 'Filtro por departamento',
        value: 'department:Ciencias',
      },
      course: {
        summary: 'Filtro por curso',
        value: 'course:1 ESO',
      },
      combined: {
        summary: 'Filtros combinados',
        value: 'activo,department:Matemáticas,course:bachillerato',
      },
    },
  })
  @IsString()
  @IsOptional()
  filters?: string;
}
