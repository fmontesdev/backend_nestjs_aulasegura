export class ValidateScheduleOverlapDto {
  academicYearId!: number;
  dayOfWeek!: number;
  startTime!: string;
  endTime!: string;
  currentDate!: string;
  excludeScheduleId?: number;
}
