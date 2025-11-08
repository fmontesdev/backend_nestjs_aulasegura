import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsPositive, IsArray, ArrayMinSize, ArrayNotEmpty, MaxLength } from 'class-validator';

export class CreateSubjectRequest {
  @ApiProperty({ description: 'Código único de la asignatura', example: 'MATH-ALG', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Subject code must not exceed 50 characters' })
  subjectCode!: string;

  @ApiProperty({ description: 'Nombre de la asignatura', example: 'Álgebra Lineal', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Subject name must not exceed 100 characters' })
  name!: string;

  @ApiProperty({ description: 'ID del departamento al que pertenece', example: 1 })
  @IsInt()
  @IsPositive()
  departmentId!: number;

  @ApiProperty({ description: 'IDs de los cursos a los que se asigna la asignatura', example: [1, 2], type: [Number] })
  @IsArray()
  @ArrayNotEmpty({ message: 'At least one course must be assigned' })
  @ArrayMinSize(1, { message: 'At least one course must be assigned' })
  @IsInt({ each: true })
  @IsPositive({ each: true })
  courseIds!: number[];
}
