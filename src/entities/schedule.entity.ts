import { Entity, Column, PrimaryGeneratedColumn, Index, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { AcademicYearEntity } from './academic-year.entity';
import { PermissionEntity } from './permission.entity';

export enum ScheduleType {
  WEEKLY = 'weekly',
  EVENT = 'event',
}

@Entity({ name: 'schedule' })
@Index('idx_schedule_year', ['academicYearId'])
@Index('idx_schedule_type', ['type'])
export class ScheduleEntity {
  @PrimaryGeneratedColumn({ name: 'schedule_id', type: 'bigint' })
  scheduleId!: string;

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

  //! Añadir relación con WeeklyScheduleEntity y EventScheduleEntity si es necesario
}
