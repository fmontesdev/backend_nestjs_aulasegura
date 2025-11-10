import { Entity, Column, PrimaryColumn, Index, OneToOne, JoinColumn } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Entity({ name: 'weekly_schedule' })
@Index('idx_weekly_dow', ['dayOfWeek'])
export class WeeklyScheduleEntity {
  @PrimaryColumn({ name: 'schedule_id', type: 'int' })
  scheduleId!: number;

  @OneToOne(() => ScheduleEntity, (s) => s.weeklySchedule, { onDelete: 'CASCADE', eager: true, cascade: true })
  @JoinColumn({ name: 'schedule_id', referencedColumnName: 'scheduleId' })
  schedule!: ScheduleEntity;

  @Column({ name: 'day_of_week', type: 'tinyint' })
  dayOfWeek!: number; // 1=Lunes, 7=Domingo

  @Column({ name: 'start_time', type: 'time' })
  startTime!: string; // 'HH:MM:SS'

  @Column({ name: 'end_time', type: 'time' })
  endTime!: string;
}
