import { WeeklyScheduleEntity } from '../entities/weekly-schedule.entity';

export abstract class WeeklyScheduleRepository {
  abstract findAll(): Promise<WeeklyScheduleEntity[]>;
  abstract findAllActive(): Promise<WeeklyScheduleEntity[]>;
  abstract findOneById(scheduleId: number): Promise<WeeklyScheduleEntity | null>;
  abstract findOneActiveById(scheduleId: number): Promise<WeeklyScheduleEntity | null>;
  abstract save(weeklySchedule: WeeklyScheduleEntity): Promise<WeeklyScheduleEntity>;
}
