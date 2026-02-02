import { UserEntity } from '../entities/user.entity';
import { RoleEntity } from '../entities/role.entity';
import { TeacherEntity } from '../entities/teacher.entity';

export abstract class UsersRepository {
  abstract findAll(): Promise<UserEntity[]>;
  abstract findOneById(userId: string): Promise<UserEntity | null>;
  abstract findTeacherByUserId(userId: string): Promise<TeacherEntity | null>;
  abstract findOneByEmail(email: string): Promise<UserEntity | null>;
  abstract create(data: Partial<UserEntity>): UserEntity;
  abstract save(user: UserEntity): Promise<UserEntity>;
  abstract deleteById(userId: string): Promise<void>;
  abstract existsById(userId: string): Promise<boolean>;
  abstract findRoleByName(name: string): Promise<RoleEntity | null>;
  abstract saveTeacher(teacher: TeacherEntity): Promise<TeacherEntity>;
}
