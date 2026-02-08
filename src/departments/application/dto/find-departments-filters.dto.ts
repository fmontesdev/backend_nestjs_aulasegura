/**
 * DTO interno para los filtros de búsqueda de departamentos.
 * Este objeto es utilizado por el repositorio y servicio para aplicar filtros a la consulta.
 */
export interface FindDepartmentsFiltersDto {
  page: number;
  limit: number;
  globalSearch?: string[];
  name?: string;
  isActive?: boolean;
  subjectCode?: string;
  teacherName?: string;
}
