import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CourseEntity } from '../../../courses/domain/entities/course.entity';
import { SubjectEntity } from '../../../subjects/domain/entities/subject.entity';
import { TeacherEntity } from './teacher.entity';

@Entity({ name: 'teacher_subject_course' })
@Index('uq_teacher_subject_course_natural_assignment', ['userId', 'courseId', 'subjectId'], { unique: true })
@Index('idx_teacher_subject_course_course_subject', ['courseId', 'subjectId'])
@Index('idx_teacher_subject_course_subject', ['subjectId'])
export class TeacherSubjectCourseEntity {
  @PrimaryGeneratedColumn({ name: 'assignment_id', type: 'bigint' })
  assignmentId!: number;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId!: string;

  @Column({ name: 'subject_id', type: 'bigint' })
  subjectId!: number;

  @Column({ name: 'course_id', type: 'int' })
  courseId!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToOne(() => TeacherEntity, (teacher) => teacher.subjectCourseAssignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  teacher!: TeacherEntity;

  @ManyToOne(() => SubjectEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'subject_id', referencedColumnName: 'subjectId' })
  subject!: SubjectEntity;

  @ManyToOne(() => CourseEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'course_id', referencedColumnName: 'courseId' })
  course!: CourseEntity;
}
