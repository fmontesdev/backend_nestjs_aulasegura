import { AcademicYearEntity } from 'src/academic-years/domain/entities/academic-year.entity';

export class CreateWeeklyScheduleDto {
  academicYear!: AcademicYearEntity;
  dayOfWeek!: number;
  startTime!: string;
  endTime!: string;
  validFrom!: string;
  validTo?: string | null;
}
