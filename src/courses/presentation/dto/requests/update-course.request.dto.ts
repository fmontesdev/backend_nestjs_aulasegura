import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsInt, Min, Max, IsOptional, Matches, IsBoolean } from 'class-validator';
import { EducationStage } from '../../../domain/enums/education-stage.enum';
import { CFLevel } from '../../../domain/enums/cf-level.enum';

export class UpdateCourseRequest {
  @ApiPropertyOptional({ description: 'Código único del curso', example: 'MATH-102', maxLength: 20 })
  @IsString()
  @IsOptional()
  courseCode?: string;

  @ApiPropertyOptional({ description: 'Nombre del curso', example: 'Matemáticas 2º ESO', maxLength: 50 })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Nivel educativo del curso', enum: EducationStage, example: EducationStage.BACHILLERATO })
  @IsEnum(EducationStage, { message: `Level must be one of: ${Object.values(EducationStage).join(', ')}` })
  @IsOptional()
  educationStage?: EducationStage;

  @ApiPropertyOptional({ description: 'Nivel del curso (1-4)', example: 2, minimum: 1, maximum: 4 })
  @IsInt()
  @Min(1, { message: 'Level must be at least 1' })
  @Max(4, { message: 'Level must be at most 4' })
  @IsOptional()
  levelNumber?: number;

  @ApiPropertyOptional({ description: 'Nivel de ciclo formativo', enum: CFLevel, example: CFLevel.CFGM, nullable: true, default: null })
  @IsEnum(CFLevel, { message: `Level must be one of: ${Object.values(CFLevel).join(', ')}` })
  @IsOptional() 
  cfLevel?: CFLevel | null;

  @ApiPropertyOptional({ description: 'Código del año académico (formato: YYYY-YYYY)', example: '2024-2025' })
  @IsString()
  @Matches(/^\d{4}-\d{4}$/, { message: 'Academic year code must be in format YYYY-YYYY' })
  @IsOptional()
  academicYearCode?: string;

  @ApiPropertyOptional({ description: 'Estado de activación del curso', example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
