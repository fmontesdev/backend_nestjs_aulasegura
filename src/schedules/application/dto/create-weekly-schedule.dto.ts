export class CreateWeeklyScheduleDto {
  dayOfWeek!: number;
  startTime!: string;
  endTime!: string;
  validFrom!: string;
  validTo?: string | null;
}
