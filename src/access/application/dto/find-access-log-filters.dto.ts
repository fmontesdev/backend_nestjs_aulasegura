import { AccessMethod } from '../../domain/enums/access-method.enum';
import { AccessStatus } from '../../domain/enums/access-status.enum';

export enum AccessLogDateFilter {
  ALL = 'todos',
  TODAY = 'hoy',
  WEEK = 'semana',
  MONTH = 'mes',
}

export interface FindAccessLogFiltersDto {
  page: number;
  limit: number;
  globalSearch?: string[];
  user?: string;
  accessMethod?: AccessMethod;
  dateFilter?: AccessLogDateFilter;
  room?: string;
  accessStatus?: AccessStatus;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
