import { EventScheduleEntity } from '../entities/event-schedule.entity';

export abstract class EventScheduleRepository {
  abstract findAll(): Promise<EventScheduleEntity[]>;
  abstract findAllActive(): Promise<EventScheduleEntity[]>;
  abstract findOneById(scheduleId: number): Promise<EventScheduleEntity | null>;
  abstract save(eventSchedule: EventScheduleEntity): Promise<EventScheduleEntity>;
}
