export interface CreateEventSchedulePermissionDto {
  userId?: string;
  roomId: number;
  description: string;
  startAt: string;
  endAt: string;
}
