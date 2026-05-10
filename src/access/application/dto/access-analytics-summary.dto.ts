import { RoleName } from '../../../users/domain/enums/rolename.enum';

export enum AccessAnalyticsDateFilter {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
}

export interface AccessAnalyticsKpisDto {
  totalAccesses: number;
  allowedAccesses: number;
  deniedAccesses: number;
  denialRate: number;
}

export interface TopDeniedRoomDto {
  roomId: number;
  roomCode: string;
  roomName: string;
  building: number;
  floor: number;
  deniedCount: number;
}

export interface TopDeniedUserDto {
  userId: string;
  name: string;
  lastname: string;
  email: string;
  avatar: string | null;
  roles: RoleName[];
  deniedCount: number;
}

export interface HourlyActivityDto {
  hour: number;
  total: number;
  allowed: number;
  denied: number;
  timeout: number;
  exit: number;
}

export interface AccessAnalyticsSummaryDto {
  kpis: AccessAnalyticsKpisDto;
  topDeniedRooms: TopDeniedRoomDto[];
  topDeniedUsers: TopDeniedUserDto[];
  hourlyActivity: HourlyActivityDto[];
}
