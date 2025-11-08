import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateDepartmentRequest {
  @ApiPropertyOptional({ description: 'Nombre del departamento', example: 'Matemáticas', maxLength: 50 })
  @IsString()
  @MaxLength(50, { message: 'Department name must not exceed 50 characters' })
  @IsOptional()
  name?: string;
}
