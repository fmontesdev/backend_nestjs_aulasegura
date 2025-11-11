import { EventStatus } from 'src/schedules/domain/enums/event-status.enum';

export class UpdateEventScheduleDto {
  description?: string;
  status?: EventStatus;
  reservationStatusReason?: string;
}
