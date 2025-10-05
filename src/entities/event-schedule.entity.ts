import { Entity, Column, PrimaryColumn, Index, OneToOne, JoinColumn } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

export enum EventScheduleType {
  RESERVATION = 'reservation',
  TEMP_PASS = 'temp_pass',
}
export enum EventStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REVOKED = 'revoked',
  ACTIVE = 'active',
  EXPIRED = 'expired',
}

@Entity({ name: 'event_schedule' })
@Index('idx_event_time', ['startAt', 'endAt'])
export class EventScheduleEntity {
  @PrimaryColumn({ name: 'schedule_id', type: 'bigint' })
  scheduleId!: string;

  @OneToOne(() => ScheduleEntity, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'schedule_id', referencedColumnName: 'scheduleId' })
  schedule!: ScheduleEntity;

  @Column({ name: 'type', type: 'enum', enum: EventScheduleType })
  type!: EventScheduleType;

  @Column({ name: 'start_at', type: 'datetime' })
  startAt!: Date;

  @Column({ name: 'end_at', type: 'datetime' })
  endAt!: Date;

  @Column({ name: 'status', type: 'enum', enum: EventStatus, default: EventStatus.PENDING })
  status!: EventStatus;

  @Column({ name: 'reason', type: 'varchar', length: 100 })
  reason!: string;
}
