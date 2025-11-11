export class ValidateWeeklyScheduleOverlapDto {
  roomId!: number;
  academicYearId!: number;
  dayOfWeek!: number;
  startTime!: string;
  endTime!: string;
}
