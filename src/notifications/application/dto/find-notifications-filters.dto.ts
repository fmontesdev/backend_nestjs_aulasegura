export interface FindNotificationsFiltersDto {
  page: number;
  limit: number;
  read?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
