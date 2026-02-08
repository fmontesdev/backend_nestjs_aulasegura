import { DepartmentEntity } from '../entities/department.entity';
import { FindDepartmentsFiltersDto } from '../../application/dto/find-departments-filters.dto';

export abstract class DepartmentRepository {
  abstract findAll(): Promise<DepartmentEntity[]>;
  abstract findAllWithFilters(filters: FindDepartmentsFiltersDto): Promise<{ data: DepartmentEntity[]; total: number }>;
  abstract findOneById(departmentId: number): Promise<DepartmentEntity | null>;
  abstract findOneActiveById(departmentId: number): Promise<DepartmentEntity | null>;
  abstract save(department: DepartmentEntity): Promise<DepartmentEntity>;
}
