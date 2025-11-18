import { Entity, Column, PrimaryGeneratedColumn, Unique, Index, OneToMany, ManyToOne, ManyToMany, JoinColumn } from 'typeorm';
import { DepartmentEntity } from '../../../departments/domain/entities/department.entity';
import { CourseEntity } from '../../../courses/domain/entities/course.entity';
import { TeacherEntity } from '../../../users/domain/entities/teacher.entity';
import { AccessLogEntity } from '../../../access/domain/entities/access-log.entity';

@Entity({ name: 'subject' })
@Unique('uq_subject_code', ['subjectCode'])
@Index('idx_subject_department', ['departmentId'])
export class SubjectEntity {
  @PrimaryGeneratedColumn({ name: 'subject_id', type: 'bigint' })
  subjectId!: number;

  @Column({ name: 'subject_code', type: 'varchar', length: 50 })
  subjectCode!: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name!: string;

  @Column({ name: 'department_id', type: 'int' })
  departmentId!: number;

  @ManyToOne(() => DepartmentEntity, (d) => d.subjects, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'department_id' }) 
  department!: DepartmentEntity;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToMany(() => CourseEntity, (c) => c.subjects)
  courses!: CourseEntity[];

  @ManyToMany(() => TeacherEntity, (t) => t.subjects)
  teachers!: TeacherEntity[];

  @OneToMany(() => AccessLogEntity, (al) => al.subject)
  accessLogs!: AccessLogEntity[];
}
