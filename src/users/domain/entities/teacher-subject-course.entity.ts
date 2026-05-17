import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CourseEntity } from '../../../courses/domain/entities/course.entity';
import { SubjectEntity } from '../../../subjects/domain/entities/subject.entity';
import { TeacherEntity } from './teacher.entity';

@Entity({ name: 'teacher_subject_course' })
@Index('idx_teacher_subject_course_course_subject', ['courseId', 'subjectId'])
@Index('idx_teacher_subject_course_subject', ['subjectId'])
export class TeacherSubjectCourseEntity {
  @PrimaryColumn({ name: 'user_id', type: 'char', length: 36 })
  userId!: string;

  @PrimaryColumn({ name: 'subject_id', type: 'bigint' })
  subjectId!: number;

  @PrimaryColumn({ name: 'course_id', type: 'int' })
  courseId!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToOne(() => TeacherEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  teacher!: TeacherEntity;

  @ManyToOne(() => SubjectEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'subject_id', referencedColumnName: 'subjectId' })
  subject!: SubjectEntity;

  @ManyToOne(() => CourseEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'course_id', referencedColumnName: 'courseId' })
  course!: CourseEntity;
}
