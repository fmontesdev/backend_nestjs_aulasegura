export interface FindReadersFiltersDto {
  page: number;
  limit: number;
  globalSearch?: string[];
  code?: string;
  room?: string;
  isActive?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
