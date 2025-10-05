import { Entity, Column, PrimaryColumn, Index, OneToOne, JoinColumn } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Entity({ name: 'weekly_schedule' })
@Index('idx_weekly_dow', ['dayOfWeek', 'validFrom', 'validTo'])
export class WeeklyScheduleEntity {
  @PrimaryColumn({ name: 'schedule_id', type: 'bigint' })
  scheduleId!: string;

  @OneToOne(() => ScheduleEntity, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'schedule_id', referencedColumnName: 'scheduleId' })
  schedule!: ScheduleEntity;

  @Column({ name: 'day_of_week', type: 'tinyint' })
  dayOfWeek!: number; // 1=Lunes

  @Column({ name: 'start_time', type: 'time' })
  startTime!: string; // 'HH:MM:SS'

  @Column({ name: 'end_time', type: 'time' })
  endTime!: string;

  @Column({ name: 'valid_from', type: 'date' })
  validFrom!: string; // 'YYYY-MM-DD'

  @Column({ name: 'valid_to', type: 'date', nullable: true })
  validTo!: string | null;
}
