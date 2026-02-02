import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentEntity } from '../../../domain/entities/department.entity';
import { DepartmentRepository } from '../../../domain/repositories/department.repository';

@Injectable()
export class TypeOrmDepartmentRepository implements DepartmentRepository {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly repository: Repository<DepartmentEntity>,
  ) {}

  async findAll(): Promise<DepartmentEntity[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { departmentId: 'ASC' },
    });
  }

  // Utilizados leftJoinAndSelect (QueryBuilder) para poder listar departamentos aunque no tengan subjects o teachers asociados

  async findAllWithRelations(): Promise<DepartmentEntity[]> {
    return this.repository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.subjects', 'subject')
      .leftJoinAndSelect('subject.courses', 'course')
      .leftJoinAndSelect('course.academicYears', 'academicYear', 'academicYear.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('department.teachers', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .where('department.isActive = :isActive', { isActive: true })
      .orderBy('department.departmentId', 'ASC')
      .getMany();
  }

  async findOneById(departmentId: number): Promise<DepartmentEntity | null> {
    return this.repository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.subjects', 'subject')
      .leftJoinAndSelect('subject.courses', 'course')
      .leftJoinAndSelect('course.academicYears', 'academicYear', 'academicYear.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('department.teachers', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .where('department.departmentId = :departmentId', { departmentId })
      .getOne();
  }

  async findOneActiveById(departmentId: number): Promise<DepartmentEntity | null> {
    return this.repository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.subjects', 'subject')
      .leftJoinAndSelect('subject.courses', 'course')
      .leftJoinAndSelect('course.academicYears', 'academicYear', 'academicYear.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('department.teachers', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .where('department.departmentId = :departmentId', { departmentId })
      .andWhere('department.isActive = :isActive', { isActive: true })
      .getOne();
  }

  async save(department: DepartmentEntity): Promise<DepartmentEntity> {
    return this.repository.save(department);
  }
}
