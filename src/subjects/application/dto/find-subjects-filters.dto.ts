/**
 * DTO interno para los filtros de búsqueda de asignaturas.
 * Este objeto es utilizado por el repositorio y servicio para aplicar filtros a la consulta.
 */
export interface FindSubjectsFiltersDto {
  page: number;
  limit: number;
  globalSearch?: string[];
  subjectCode?: string;
  name?: string;
  isActive?: boolean;
  departmentName?: string;
  courseCode?: string;
}
