import { 
  Entity, Column, PrimaryGeneratedColumn, Unique, Index, OneToOne, ManyToMany, JoinTable
} from 'typeorm';
import { AcademicYearEntity } from './academic-year.entity';
import { RoomEntity } from './room.entity';
import { SubjectEntity } from './subject.entity';

export enum CourseLevel {
  ESO = 'ESO',
  BACHILLERATO = 'bachillerato',
  FP = 'FP',
}

@Entity({ name: 'course' })
@Unique('uq_course_code', ['courseCode'])
@Index('idx_course_year', ['academicYearId'])
export class CourseEntity {
  @PrimaryGeneratedColumn({ name: 'course_id', type: 'int' })
  courseId!: number;

  @Column({ name: 'course_code', type: 'varchar', length: 20 })
  courseCode!: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name!: string;

  @Column({ name: 'academic_year_id', type: 'int' })
  academicYearId!: number;

  @ManyToMany(() => AcademicYearEntity, (ay) => ay.courses)
  academicYears!: AcademicYearEntity[];

  @Column({ name: 'level', type: 'enum', enum: CourseLevel })
  level!: CourseLevel;

  @Column({ name: 'stage', type: 'tinyint' })
  stage!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToOne(() => RoomEntity, (r) => r.course)
  room?: RoomEntity;

  @ManyToMany(() => SubjectEntity, (r) => r.courses, { cascade: false })
  @JoinTable({
    name: 'course_subject',
    joinColumn: { name: 'course_id', referencedColumnName: 'courseId' },
    inverseJoinColumn: { name: 'subject_id', referencedColumnName: 'subjectId' },
  })
  subjects!: SubjectEntity[];
}
