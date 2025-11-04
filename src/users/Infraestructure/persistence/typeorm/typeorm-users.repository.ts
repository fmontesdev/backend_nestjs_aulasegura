import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { UserEntity } from '../../../domain/entities/user.entity';
import { RoleEntity } from '../../../domain/entities/role.entity';
import { TeacherEntity } from '../../../domain/entities/teacher.entity';

@Injectable()
export class TypeormUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepo.find({ 
      relations: ['roles', 'teacher', 'teacher.department'],
      order: { createdAt: 'DESC' } 
    });
  }

  async findOneById(userId: string): Promise<UserEntity | null> {
    return await this.userRepo.findOne({ 
      where: { userId },
      relations: ['roles', 'teacher', 'teacher.department'] 
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepo.findOne({ 
      where: { email },
      relations: ['roles', 'teacher', 'teacher.department'] 
    });
  }

  create(data: Partial<UserEntity>): UserEntity {
    return this.userRepo.create(data);
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return await this.userRepo.save(user);
  }

  async deleteById(userId: string): Promise<void> {
    await this.userRepo.delete(userId);
  }

  async existsById(userId: string): Promise<boolean> {
    const count = await this.userRepo.count({ where: { userId } });
    return count > 0;
  }

  async findRoleByName(name: string): Promise<RoleEntity | null> {
    return await this.roleRepo.findOne({ where: { name: name as any } });
  }

  async saveTeacher(teacher: TeacherEntity): Promise<TeacherEntity> {
    return await this.teacherRepo.save(teacher);
  }
}
