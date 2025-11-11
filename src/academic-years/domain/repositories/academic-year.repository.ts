import { AcademicYearEntity } from '../entities/academic-year.entity';

export abstract class AcademicYearRepository {
  abstract findAll(): Promise<AcademicYearEntity[]>;
  abstract findOneById(academicYearId: number): Promise<AcademicYearEntity | null>;
  abstract findOneByCode(code: string): Promise<AcademicYearEntity | null>;
  abstract findActive(): Promise<AcademicYearEntity | null>;
  abstract save(academicYear: AcademicYearEntity): Promise<AcademicYearEntity>;
}
