import { UserEntity } from '../entities/user.entity';
import { RoleEntity } from '../entities/role.entity';
import { TeacherEntity } from '../entities/teacher.entity';
import { FindUsersFiltersDto, PaginatedResult } from '../../application/dto/find-users-filters.dto';

export abstract class UsersRepository {
  abstract findAllWithFilters(filters: FindUsersFiltersDto): Promise<PaginatedResult<UserEntity>>;
  abstract findOneById(userId: string): Promise<UserEntity | null>;
  abstract findOneByEmail(email: string): Promise<UserEntity | null>;
  abstract findTeacherByUserId(userId: string): Promise<TeacherEntity | null>;
  abstract findRoleByName(name: string): Promise<RoleEntity | null>;
  abstract create(data: Partial<UserEntity>): UserEntity;
  abstract save(user: UserEntity): Promise<UserEntity>;
  abstract saveTeacher(teacher: TeacherEntity): Promise<TeacherEntity>;
  abstract deleteById(userId: string): Promise<void>;
  abstract deleteTeacher(userId: string): Promise<void>;
  abstract existsById(userId: string): Promise<boolean>;
}
