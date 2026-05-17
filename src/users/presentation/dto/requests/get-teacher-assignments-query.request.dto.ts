import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetTeacherAssignmentsQueryRequest {
  @ApiPropertyOptional({ description: 'Número de página (comienza en 1)', default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Número de items por página', default: 10, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filtros combinados. Formato: texto,campo:valor. Campos: teacher/profesor, email, course/curso, subject/asignatura, active/estado.',
    examples: {
      'Búsqueda global': { value: 'garcia' },
      'Por curso': { value: 'course:ESO-1A' },
      'Por estado': { value: 'estado:activo' },
      'Múltiples filtros': { value: 'profesor:Ana,curso:10,asignatura:MAT,active:true' },
    },
  })
  @IsString()
  @IsOptional()
  filters?: string;
}
