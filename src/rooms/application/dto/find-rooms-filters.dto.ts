export interface FindRoomsFiltersDto {
  page: number;
  limit: number;
  globalSearch?: string[];
  name?: string;
  building?: number;
  floor?: number;
  course?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
