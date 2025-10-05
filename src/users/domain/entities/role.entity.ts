import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToMany } from 'typeorm';
import { UserEntity } from './user.entity';

export enum RoleName {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  JANITOR = 'janitor',
  SUPPORT_STAFF = 'support_staff',
}

@Entity({ name: 'role' })
@Unique('uq_role_name', ['name'])
export class RoleEntity {
  @PrimaryGeneratedColumn({ name: 'role_id', type: 'int' })
  roleId!: number;

  @Column({ name: 'name', type: 'enum', enum: RoleName })
  name!: RoleName;

  @ManyToMany(() => UserEntity, (u) => u.roles)
  users!: UserEntity[];
}
