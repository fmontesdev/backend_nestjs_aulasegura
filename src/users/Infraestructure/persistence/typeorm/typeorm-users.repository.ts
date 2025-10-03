import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { UserEntity } from '../../../domain/entities/user.entity';

@Injectable()
export class TypeormUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findOneById(userId: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { userId } });
  }

  findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  create(data: Partial<UserEntity>): UserEntity {
    return this.repo.create(data);
  }

  save(user: UserEntity): Promise<UserEntity> {
    return this.repo.save(user);
  }

  async deleteById(userId: string): Promise<void> {
    await this.repo.delete(userId);
  }

  async existsById(userId: string): Promise<boolean> {
    const count = await this.repo.count({ where: { userId } });
    return count > 0;
  }
}
