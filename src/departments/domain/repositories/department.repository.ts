import { DepartmentEntity } from '../entities/department.entity';

export abstract class DepartmentRepository {
  abstract findAll(): Promise<DepartmentEntity[]>;
  abstract findOneById(departmentId: number): Promise<DepartmentEntity | null>;
  abstract findOneActiveById(departmentId: number): Promise<DepartmentEntity | null>;
  abstract save(department: DepartmentEntity): Promise<DepartmentEntity>;
}
