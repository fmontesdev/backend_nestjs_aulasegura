export class CreateWeeklySchedulePermissionDto {
  userId!: string;
  roomId!: number;
  scheduleId!: number;
  assignmentId?: number;
  createdById!: string;
}
