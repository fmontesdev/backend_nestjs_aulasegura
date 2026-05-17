import { TagType } from '../../domain/enums/tag-type.enum';

export interface FindTagsFiltersDto {
  page: number;
  limit: number;
  globalSearch?: string[];
  type?: TagType;
  user?: string;
  email?: string;
  isActive?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
