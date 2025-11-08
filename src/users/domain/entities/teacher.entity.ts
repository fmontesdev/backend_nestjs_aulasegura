import { Entity, Column, PrimaryColumn, Index, OneToOne, ManyToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { UserEntity } from './user.entity';
import { DepartmentEntity } from '../../../departments/domain/entities/department.entity';
import { SubjectEntity } from '../../../subjects/domain/entities/subject.entity';

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

  @ManyToMany(() => SubjectEntity, (s) => s.teachers)
  @JoinTable({
    name: 'teacher_subject',
    joinColumn: { name: 'user_id', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'subject_id', referencedColumnName: 'subjectId' },
  })
  subjects!: SubjectEntity[];
}
