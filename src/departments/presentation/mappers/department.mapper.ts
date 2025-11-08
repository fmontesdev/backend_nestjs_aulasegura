import { DepartmentEntity } from '../../domain/entities/department.entity';
import { DepartmentResponse } from '../dto/responses/department.response.dto';
import { SubjectMapper } from '../../../subjects/presentation/mappers/subject.mapper';
import { UserMapper } from '../../../users/presentation/mappers/user.mapper';

export class DepartmentMapper {
  static toResponse(entity: DepartmentEntity): DepartmentResponse {
    return {
      departmentId: entity.departmentId,
      name: entity.name,
      isActive: entity.isActive,
      subjects: entity.subjects ? SubjectMapper.toSimpleResponseList(entity.subjects) : [],
      teachers: entity.teachers ? UserMapper.toResponseList(entity.teachers.map(teacher => teacher.user)) : [],
    };
  }

  static toResponseList(entities: DepartmentEntity[]): DepartmentResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }

  // Métodos simplificado sin subjects ni teachers para evitar recursión infinita

  static toSimpleResponse(entity: DepartmentEntity): DepartmentResponse {
    return {
      departmentId: entity.departmentId,
      name: entity.name,
      isActive: entity.isActive,
    };
  }

  static toSimpleResponseList(entities: DepartmentEntity[]): DepartmentResponse[] {
    return entities.map((entity) => this.toSimpleResponse(entity));
  }
}
