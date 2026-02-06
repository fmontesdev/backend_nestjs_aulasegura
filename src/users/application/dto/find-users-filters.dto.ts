import { RoleName } from '../../domain/enums/rolename.enum';

export enum UserState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface FindUsersFiltersDto {
  page: number;
  limit: number;
  globalSearch?: string[]; // Términos de búsqueda que se aplicarán a múltiples campos
  fullName?: string;
  email?: string;
  roles?: RoleName[];
  departmentName?: string;
  state?: UserState;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
