import { DepartmentEntity } from '../../../entities/department.entity';
import { DepartmentResponse } from '../dto/responses/department.response.dto';

export class DepartmentMapper {
  static toResponse(entity: DepartmentEntity): DepartmentResponse {
    return {
      departmentId: entity.departmentId,
      name: entity.name,
    };
  }
}
