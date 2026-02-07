import { EducationStage } from '../../domain/enums/education-stage.enum';
import { CFLevel } from '../../domain/enums/cf-level.enum';

export interface UpdateCourseDto {
  courseCode?: string;
  name?: string;
  educationStage?: EducationStage;
  levelNumber?: number;
  cfLevel?: CFLevel | null;
  academicYearCode?: string;
  isActive?: boolean;
}
