import { AcademicYearEntity } from 'src/academic-years/domain/entities/academic-year.entity';
import { EventScheduleType } from 'src/schedules/domain/enums/event-schedule-type.enum';

export class CreateEventScheduleDto {
  academicYear!: AcademicYearEntity;
  type!: EventScheduleType;
  description!: string;
  startAt!: Date;
  endAt!: Date;
}
