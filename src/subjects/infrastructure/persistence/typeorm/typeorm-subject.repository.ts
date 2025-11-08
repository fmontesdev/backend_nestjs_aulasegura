import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubjectEntity } from '../../../domain/entities/subject.entity';
import { SubjectRepository } from '../../../domain/repositories/subject.repository';

@Injectable()
export class TypeOrmSubjectRepository implements SubjectRepository {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly repository: Repository<SubjectEntity>,
  ) {}

  async findAll(): Promise<SubjectEntity[]> {
    return this.repository.find({
      where: { isActive: true },
      relations: ['department', 'courses', 'courses.academicYears'],
      order: { subjectId: 'ASC' },
    });
  }

  async findOneById(subjectId: number): Promise<SubjectEntity | null> {
    return this.repository.findOne({
      where: { subjectId },
      relations: ['department', 'courses', 'courses.academicYears'],
    });
  }

  async findOneActiveById(subjectId: number): Promise<SubjectEntity | null> {
    return this.repository.findOne({
      where: { subjectId, isActive: true },
      relations: ['department', 'courses', 'courses.academicYears'],
    });
  }

  async findOneBySubjectCode(subjectCode: string): Promise<SubjectEntity | null> {
    return this.repository.findOne({
      where: { subjectCode },
    });
  }

  async save(subject: SubjectEntity): Promise<SubjectEntity> {
    return this.repository.save(subject);
  }
}
