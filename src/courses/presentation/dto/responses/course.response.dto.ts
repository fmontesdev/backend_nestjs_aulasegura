import { ApiProperty } from '@nestjs/swagger';
import { EducationStage } from '../../../domain/enums/education-stage.enum';
import { CFLevel } from '../../../domain/enums/cf-level.enum';
import { AcademicYearResponse } from '../../../../academic-years/presentation/dto/responses/academic-year.response.dto';

export class CourseResponse {
  @ApiProperty({ description: 'Identificador único del curso', example: 1 })
  courseId: number;

  @ApiProperty({ description: 'Código único del curso', example: 'MATH-101' })
  courseCode: string;

  @ApiProperty({ description: 'Nombre del curso', example: 'Matemáticas 1º ESO' })
  name: string;

  @ApiProperty({ description: 'Nivel educativo del curso', enum: EducationStage, example: EducationStage.ESO })
  educationStage: EducationStage;

  @ApiProperty({ description: 'Nivel del curso (1-4)', example: 1 })
  levelNumber: number;

  @ApiProperty({ description: 'Nivel de ciclo formativo', enum: CFLevel, example: CFLevel.CFGM, nullable: true, default: null })
  cfLevel?: CFLevel | null;

  @ApiProperty({ description: 'Estado del curso (eliminación lógica)', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Años académicos asociados al curso', type: [AcademicYearResponse] })
  academicYears: AcademicYearResponse[] | [];
}
