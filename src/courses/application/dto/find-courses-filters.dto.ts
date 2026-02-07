import { EducationStage } from '../../domain/enums/education-stage.enum';
import { CFLevel } from '../../domain/enums/cf-level.enum';

/**
 * DTO interno para los filtros de búsqueda de cursos
 * Utilizado entre el controlador, servicio y repositorio
 */
export interface FindCoursesFiltersDto {
  page?: number;
  limit?: number;
  globalSearch?: string[];
  courseCode?: string;
  name?: string;
  educationStage?: EducationStage;
  levelNumber?: number;
  cfLevel?: CFLevel;
  isActive?: boolean;
}
