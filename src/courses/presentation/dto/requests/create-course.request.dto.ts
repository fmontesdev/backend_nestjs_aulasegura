import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsInt, Min, Max, IsOptional, Matches } from 'class-validator';
import { EducationStage } from '../../../domain/enums/education-stage.enum';
import { CFLevel } from '../../../domain/enums/cf-level.enum';

export class CreateCourseRequest {
  @ApiProperty({ description: 'Código único del curso', example: 'MATH-101', maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  courseCode!: string;

  @ApiProperty({ description: 'Nombre del curso', example: 'Matemáticas 1º ESO', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Nivel educativo del curso', enum: EducationStage, example: EducationStage.ESO })
  @IsEnum(EducationStage, { message: `Level must be one of: ${Object.values(EducationStage).join(', ')}` })
  educationStage!: EducationStage;

  @ApiProperty({ description: 'Nivel del curso (1-4)', example: 1, minimum: 1, maximum: 4 })
  @IsInt()
  @Min(1, { message: 'Level must be at least 1' })
  @Max(4, { message: 'Level must be at most 4' })
  levelNumber!: number;

  @ApiProperty({ description: 'Nivel de ciclo formativo', enum: CFLevel, example: CFLevel.CFGM, nullable: true, default: null })
  @IsEnum(CFLevel, { message: `Level must be one of: ${Object.values(CFLevel).join(', ')}` })
  @IsOptional() 
  cfLevel?: CFLevel | null;

  @ApiProperty({ description: 'Código del año académico al que pertenece el curso (formato YYYY-YYYY)', example: '2024-2025' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{4}$/, { message: 'academicYearCode must be in format YYYY-YYYY (e.g., 2024-2025)' })
  academicYearCode!: string;
}
