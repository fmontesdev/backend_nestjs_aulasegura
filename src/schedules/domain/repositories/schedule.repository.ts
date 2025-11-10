import { ScheduleEntity } from '../entities/schedule.entity';

export abstract class ScheduleRepository {
  abstract findAllActive(): Promise<ScheduleEntity[]>;
  abstract findOneById(scheduleId: number): Promise<ScheduleEntity | null>;
  abstract save(schedule: ScheduleEntity): Promise<ScheduleEntity>;
  abstract delete(scheduleId: number): Promise<void>;
}
