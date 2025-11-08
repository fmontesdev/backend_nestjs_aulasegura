import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicYearEntity } from '../../../domain/entities/academic-year.entity';
import { AcademicYearRepository } from '../../../domain/repositories/academic-year.repository';

@Injectable()
export class TypeOrmAcademicYearRepository implements AcademicYearRepository {
  constructor(
    @InjectRepository(AcademicYearEntity)
    private readonly repository: Repository<AcademicYearEntity>,
  ) {}

  async findAll(): Promise<AcademicYearEntity[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { code: 'DESC' },
    });
  }

  async findOneById(academicYearId: number): Promise<AcademicYearEntity | null> {
    return this.repository.findOne({
      where: { academicYearId },
    });
  }

  async findOneActiveById(academicYearId: number): Promise<AcademicYearEntity | null> {
    return this.repository.findOne({
      where: { academicYearId, isActive: true },
    });
  }

  async findOneByCode(code: string): Promise<AcademicYearEntity | null> {
    return this.repository.findOne({
      where: { code },
    });
  }

  async save(academicYear: AcademicYearEntity): Promise<AcademicYearEntity> {
    return this.repository.save(academicYear);
  }
}
