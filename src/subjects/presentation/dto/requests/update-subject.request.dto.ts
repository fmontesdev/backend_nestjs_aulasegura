import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsPositive, IsOptional, IsArray, ArrayMinSize, ArrayNotEmpty, MaxLength, IsBoolean } from 'class-validator';

export class UpdateSubjectRequest {
  @ApiPropertyOptional({ description: 'Código único de la asignatura', example: 'MATH-ALG', maxLength: 50 })
  @IsString()
  @MaxLength(50, { message: 'Subject code must not exceed 50 characters' })
  @IsOptional()
  subjectCode?: string;

  @ApiPropertyOptional({ description: 'Nombre de la asignatura', example: 'Álgebra Lineal', maxLength: 100 })
  @IsString()
  @MaxLength(100, { message: 'Subject name must not exceed 100 characters' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'ID del departamento al que pertenece', example: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional({ description: 'IDs de los cursos a los que se asigna la asignatura', example: [1, 2], type: [Number] })
  @IsArray()
  @ArrayNotEmpty({ message: 'At least one course must be assigned' })
  @ArrayMinSize(1, { message: 'At least one course must be assigned' })
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsOptional()
  courseIds?: number[];

  @ApiPropertyOptional({ description: 'Estado de activación de la asignatura', example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
