import { Entity, Column, PrimaryColumn, Index, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { DepartmentEntity } from '../../../departments/domain/entities/department.entity';
import { TeacherSubjectCourseEntity } from './teacher-subject-course.entity';

@Entity({ name: 'teacher' })
@Index('idx_teacher_department', ['departmentId'])
export class TeacherEntity {
  @PrimaryColumn({ name: 'user_id', type: 'char', length: 36 })
  userId!: string; // PK compartida con user

  @OneToOne(() => UserEntity, (u) => u.teacher, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user!: UserEntity;

  @Column({ name: 'department_id', type: 'int' })
  departmentId!: number;

  @ManyToOne(() => DepartmentEntity, (d) => d.teachers, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'department_id' }) 
  department!: DepartmentEntity;

  @OneToMany(() => TeacherSubjectCourseEntity, (assignment) => assignment.teacher)
  subjectCourseAssignments!: TeacherSubjectCourseEntity[];
}
