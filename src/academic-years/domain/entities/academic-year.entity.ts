import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { CourseEntity } from '../../../courses/domain/entities/course.entity';
import { ScheduleEntity } from '../../../schedules/domain/entities/schedule.entity';

@Entity({ name: 'academic_year' })
@Unique('uq_academic_year_code', ['code'])
export class AcademicYearEntity {
  @PrimaryGeneratedColumn({ name: 'academic_year_id', type: 'int' })
  academicYearId!: number;

  @Column({ name: 'code', type: 'varchar', length: 20 })
  code!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToMany(() => CourseEntity, (r) => r.academicYears, { cascade: false })
  @JoinTable({
    name: 'academic_year_course',
    joinColumn: { name: 'academic_year_id', referencedColumnName: 'academicYearId' },
    inverseJoinColumn: { name: 'course_id', referencedColumnName: 'courseId' },
  })
  courses!: CourseEntity[];

  @OneToMany(() => ScheduleEntity, (s) => s.academicYear)
  schedules!: ScheduleEntity[];
}
