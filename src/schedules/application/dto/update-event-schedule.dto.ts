import { EventScheduleType } from 'src/schedules/domain/enums/event-schedule-type.enum';
import { EventStatus } from 'src/schedules/domain/enums/event-status.enum';

export class UpdateEventScheduleDto {
  type?: EventScheduleType;
  startAt?: Date;
  endAt?: Date;
  status?: EventStatus;
  reason?: string;
}
