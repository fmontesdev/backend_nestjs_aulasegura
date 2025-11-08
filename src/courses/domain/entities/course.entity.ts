import { Entity, Column, PrimaryGeneratedColumn, Unique, Index, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { AcademicYearEntity } from '../../../academic-years/domain/entities/academic-year.entity';
import { RoomEntity } from '../../../rooms/domain/entities/room.entity';
import { SubjectEntity } from '../../../subjects/domain/entities/subject.entity';
import { EducationStage } from '../enums/education-stage.enum';
import { CFLevel } from '../enums/cf-level.enum';

@Entity({ name: 'course' })
@Unique('uq_course_code', ['courseCode'])
@Index('idx_course_level', ['educationStage', 'levelNumber', 'cfLevel'])
export class CourseEntity {
  @PrimaryGeneratedColumn({ name: 'course_id', type: 'int' })
  courseId!: number;

  @Column({ name: 'course_code', type: 'varchar', length: 20 })
  courseCode!: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name!: string;

  @Column({ name: 'education_stage', type: 'enum', enum: EducationStage })
  educationStage!: EducationStage;

  @Column({ name: 'level_number', type: 'tinyint' })
  levelNumber!: number;

  @Column({ name: 'cf_level', type: 'enum', enum: CFLevel, nullable: true, default: null })
  cfLevel!: CFLevel | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToMany(() => AcademicYearEntity, (ay) => ay.courses)
  academicYears!: AcademicYearEntity[];

  @ManyToMany(() => SubjectEntity, (r) => r.courses, { cascade: false })
  @JoinTable({
    name: 'course_subject',
    joinColumn: { name: 'course_id', referencedColumnName: 'courseId' },
    inverseJoinColumn: { name: 'subject_id', referencedColumnName: 'subjectId' },
  })
  subjects!: SubjectEntity[];

  @OneToOne(() => RoomEntity, (r) => r.course)
  room?: RoomEntity;
}
