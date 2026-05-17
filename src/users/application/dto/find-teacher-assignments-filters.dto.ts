export interface FindTeacherAssignmentsFiltersDto {
  page: number;
  limit: number;
  globalSearch?: string[];
  teacherId?: string;
  teacher?: string;
  email?: string;
  course?: string;
  courseId?: number;
  subject?: string;
  subjectId?: number;
  isActive?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
