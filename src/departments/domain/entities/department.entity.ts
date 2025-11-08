import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SubjectEntity } from '../../../subjects/domain/entities/subject.entity';
import { TeacherEntity } from '../../../users/domain/entities/teacher.entity';

@Entity({ name: 'department' })
export class DepartmentEntity {
  @PrimaryGeneratedColumn({ name: 'department_id', type: 'int' })
  departmentId!: number;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => SubjectEntity, (s) => s.department)
  subjects!: SubjectEntity[];

  @OneToMany(() => TeacherEntity, (t) => t.department)
  teachers!: TeacherEntity[];
}
