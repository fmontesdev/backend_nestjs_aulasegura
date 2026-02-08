import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetDepartmentsQueryRequest {
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
        value: 'ciencias',
      },
      specificName: {
        summary: 'Filtro por nombre',
        value: 'name:matemáticas',
      },
      statusActive: {
        summary: 'Solo activos',
        value: 'activo',
      },
      statusInactive: {
        summary: 'Solo inactivos',
        value: 'inactivo',
      },
      subject: {
        summary: 'Filtro por asignatura',
        value: 'subject:MATH',
      },
      teacher: {
        summary: 'Filtro por profesor',
        value: 'teacher:García',
      },
      combined: {
        summary: 'Filtros combinados',
        value: 'activo,subject:MATH,teacher:Juan',
      },
    },
  })
  @IsString()
  @IsOptional()
  filters?: string;
}
