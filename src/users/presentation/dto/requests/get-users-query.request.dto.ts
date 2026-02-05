import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, IsEnum } from 'class-validator';
import { RoleName } from '../../../domain/enums/rolename.enum';
import { UserState } from '../../../application/dto/find-users-filters.dto';

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
    description: 'Búsqueda por nombre, apellido o nombre completo (parcial, case-insensitive)'
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ 
    description: 'Búsqueda por email (parcial, case-insensitive)'
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por roles',
    enum: RoleName,
    isArray: true,
    example: [RoleName.TEACHER]
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  @IsEnum(RoleName, { each: true })
  roles?: RoleName[];

  @ApiPropertyOptional({ 
    description: 'Filtrar por ID de departamento (solo para teachers)',
    type: 'integer'
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional({ 
    description: 'Filtrar por estado del usuario',
    enum: UserState,
    example: UserState.ACTIVE
  })
  @IsEnum(UserState)
  @IsOptional()
  state?: UserState;
}
