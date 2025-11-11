import { WeeklyScheduleEntity } from '../entities/weekly-schedule.entity';
import { ValidateWeeklyScheduleOverlapDto } from 'src/schedules/application/dto/validate-weekly-schedule-overlap.dto';

export abstract class WeeklyScheduleRepository {
  abstract findAll(): Promise<WeeklyScheduleEntity[]>;
  abstract findAllActive(): Promise<WeeklyScheduleEntity[]>;
  abstract findOneById(scheduleId: number): Promise<WeeklyScheduleEntity | null>;
  abstract findOneActiveById(scheduleId: number): Promise<WeeklyScheduleEntity | null>;
  abstract save(weeklySchedule: WeeklyScheduleEntity): Promise<WeeklyScheduleEntity>;
  abstract findWeeklyScheduleOverlapping(overlapDto: ValidateWeeklyScheduleOverlapDto): Promise<WeeklyScheduleEntity[]>;
}
