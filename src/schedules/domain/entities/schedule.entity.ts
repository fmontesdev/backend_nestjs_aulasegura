import { Entity, Column, PrimaryGeneratedColumn, Index, UpdateDateColumn, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { AcademicYearEntity } from '../../../academic-years/domain/entities/academic-year.entity';
import { PermissionEntity } from '../../../permissions/domain/entities/permission.entity';
import { WeeklyScheduleEntity } from './weekly-schedule.entity';
import { EventScheduleEntity } from './event-schedule.entity';
import { ScheduleType } from '../enums/schedule-type.enum';

@Entity({ name: 'schedule' })
@Index('idx_schedule_year', ['academicYearId'])
@Index('idx_schedule_type', ['type'])
export class ScheduleEntity {
  @PrimaryGeneratedColumn({ name: 'schedule_id', type: 'int' })
  scheduleId!: number;

  @Column({ name: 'type', type: 'enum', enum: ScheduleType })
  type!: ScheduleType;

  @Column({ name: 'academic_year_id', type: 'int' })
  academicYearId!: number;

  @ManyToOne(() => AcademicYearEntity, (ay) => ay.schedules, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'academic_year_id' })
  academicYear!: AcademicYearEntity;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt!: Date | null;

  @OneToMany(() => PermissionEntity, (p) => p.schedule)
  permissions!: PermissionEntity[];

  @OneToOne(() => WeeklyScheduleEntity, (ws) => ws.schedule)
  weeklySchedule?: WeeklyScheduleEntity;

  @OneToOne(() => EventScheduleEntity, (es) => es.schedule)
  eventSchedule?: EventScheduleEntity;
}
