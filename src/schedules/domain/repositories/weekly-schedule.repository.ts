import { WeeklyScheduleEntity } from '../entities/weekly-schedule.entity';

import { ValidateScheduleOverlapDto } from '../../application/dto/validate-schedule-overlap.dto';

export abstract class WeeklyScheduleRepository {
  abstract findAll(): Promise<WeeklyScheduleEntity[]>;
  abstract findAllActive(currentDate: string): Promise<WeeklyScheduleEntity[]>;
  abstract findOneById(scheduleId: number): Promise<WeeklyScheduleEntity | null>;
  abstract findOneActiveById(scheduleId: number, currentDate: string): Promise<WeeklyScheduleEntity | null>;
  abstract findOverlapping(overlapDto: ValidateScheduleOverlapDto): Promise<WeeklyScheduleEntity[]>;
  abstract save(weeklySchedule: WeeklyScheduleEntity): Promise<WeeklyScheduleEntity>;
}
