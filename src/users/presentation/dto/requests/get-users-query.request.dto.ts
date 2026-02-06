import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class GetUsersQueryRequest {
  @ApiPropertyOptional({ 
    description: 'Número de página (comienza en 1)', 
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
    default: 10,
    minimum: 1,
    maximum: 100
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ 
    description: 'Filtros combinados. Formato: valor1,campo:valor2,campo:valor3. Valores sin ":" buscan en todos los campos (fullName, email, roles, estado, departamento). La búsqueda global reconoce términos como "administrador", "profesor", "conserje", "personal" y los mapea a roles. Campos específicos: fullName, email, rol (admin|teacher|janitor|support_staff), status (active|inactive), department (nombre del departamento). Ejemplos: profesor,department:Informática | paco,rol:admin,status:active | garcia | activo',
    examples: {
      'Por rol': { value: 'profesor' },
      'Por departamento': { value: 'department:Informática' },
      'Búsqueda global': { value: 'garcia' },
      'Múltiples filtros': { value: 'profesor,department:Matemáticas,status:active' }
    }
  })
  @IsString()
  @IsOptional()
  filters?: string;
}
