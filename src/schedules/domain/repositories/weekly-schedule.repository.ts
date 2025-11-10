import { WeeklyScheduleEntity } from '../entities/weekly-schedule.entity';

export abstract class WeeklyScheduleRepository {
  abstract findAll(): Promise<WeeklyScheduleEntity[]>;
  abstract findAllActive(currentDate: string): Promise<WeeklyScheduleEntity[]>;
  abstract findOneById(scheduleId: number): Promise<WeeklyScheduleEntity | null>;
  abstract findOneActiveById(scheduleId: number, currentDate: string): Promise<WeeklyScheduleEntity | null>;
  abstract save(weeklySchedule: WeeklyScheduleEntity): Promise<WeeklyScheduleEntity>;
  abstract deleteById(scheduleId: number): Promise<void>;
}
