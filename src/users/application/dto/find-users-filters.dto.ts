import { RoleName } from '../../domain/enums/rolename.enum';

export enum UserState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface FindUsersFiltersDto {
  page: number;
  limit: number;
  fullName?: string;
  email?: string;
  roles?: RoleName[];
  departmentId?: number;
  state?: UserState;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
