import { Entity, Column, PrimaryColumn, Index, OneToOne, JoinColumn } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';
import { EventScheduleType } from '../enums/event-schedule-type.enum';
import { EventStatus } from '../enums/event-status.enum';

@Entity({ name: 'event_schedule' })
@Index('idx_event_time', ['startAt', 'endAt'])
export class EventScheduleEntity {
  @PrimaryColumn({ name: 'schedule_id', type: 'int' })
  scheduleId!: number;

  @OneToOne(() => ScheduleEntity, (s) => s.eventSchedule, { onDelete: 'CASCADE', eager: true, cascade: true })
  @JoinColumn({ name: 'schedule_id', referencedColumnName: 'scheduleId' })
  schedule!: ScheduleEntity;

  @Column({ name: 'type', type: 'enum', enum: EventScheduleType })
  type!: EventScheduleType;

  @Column({ name: 'description', type: 'varchar', length: 100 })
  description!: string;

  @Column({ name: 'start_at', type: 'datetime' })
  startAt!: Date;

  @Column({ name: 'end_at', type: 'datetime' })
  endAt!: Date;

  @Column({ name: 'status', type: 'enum', enum: EventStatus, default: EventStatus.PENDING })
  status!: EventStatus;

  @Column({ name: 'reservation_status_reason', type: 'varchar', length: 100, default: null })
  reservationStatusReason!: string;
}
