import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class GetCoursesQueryRequest {
  @ApiPropertyOptional({
    description: 'Número de página (comienza en 1)',
    example: 1,
    default: 1,
    minimum: 1
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Número de items por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filtros combinados. Formato: valor1,valor2,campo:valor3. Valores sin ":" buscan en courseCode y name, o se reconocen automáticamente (etapas, niveles, estado). La búsqueda global reconoce términos como "eso", "bachillerato", "cf/ciclos", "activo/inactivo", "cfgm/medio", "cfgs/superior", "fpb" y números 1-4 para niveles. Campos específicos: code (código curso), name (nombre curso), stage (eso|bachillerato|cf), level (1-4), cflevel (fpb|cfgm|cfgs), status (activo|inactivo). Ejemplos: eso,1,activo | code:1ESO | name:matemáticas,activo | cfgm | informática',
    examples: {
      'Por código': { value: 'code:1ESO' },
      'Por nombre': { value: 'name:matemáticas' },
      'Por etapa': { value: 'stage:eso' },
      'Por nivel': { value: 'level:1' },
      'Por nivel de CF': { value: 'cflevel:cfgm' },
      'Búsqueda global': { value: 'informática' },
      'Múltiples filtros': { value: 'stage:eso,1,activo' }
    }
  })
  @IsString()
  @IsOptional()
  filters?: string;
}
