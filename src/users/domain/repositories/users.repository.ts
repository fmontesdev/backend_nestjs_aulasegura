import { UserEntity } from '../entities/user.entity';

export abstract class UsersRepository {
  abstract findAll(): Promise<UserEntity[]>;
  abstract findOneById(userId: string): Promise<UserEntity | null>;
  abstract findOneByEmail(email: string): Promise<UserEntity | null>;
  abstract create(data: Partial<UserEntity>): UserEntity;
  abstract save(user: UserEntity): Promise<UserEntity>;
  abstract deleteById(userId: string): Promise<void>;
  abstract existsById(userId: string): Promise<boolean>;
}
