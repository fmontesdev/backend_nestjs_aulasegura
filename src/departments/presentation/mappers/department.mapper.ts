import { DepartmentEntity } from '../../domain/entities/department.entity';
import { DepartmentResponse } from '../dto/responses/department.response.dto';
import { PaginatedDepartmentsResponse } from '../dto/responses/paginated-departments.response.dto';
import { SubjectMapper } from '../../../subjects/presentation/mappers/subject.mapper';
import { UserMapper } from '../../../users/presentation/mappers/user.mapper';

export class DepartmentMapper {
  static toResponse(entity: DepartmentEntity): DepartmentResponse {
    const response: DepartmentResponse = {
      departmentId: entity.departmentId,
      name: entity.name,
      isActive: entity.isActive,
    };

    // Solo incluir subjects si existe y no está vacío
    if (entity.subjects && entity.subjects.length > 0) {
      response.subjects = SubjectMapper.toSimpleResponseList(entity.subjects);
    }

    // Solo incluir teachers si existe y no está vacío
    if (entity.teachers && entity.teachers.length > 0) {
      response.teachers = UserMapper.toResponseList(entity.teachers.map(teacher => teacher.user));
    }

    return response;
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

  static toPaginatedResponse(
    result: { data: DepartmentEntity[]; total: number },
    page: number,
    limit: number,
  ): PaginatedDepartmentsResponse {
    const totalPages = Math.ceil(result.total / limit);
    
    return {
      data: this.toResponseList(result.data),
      meta: {
        total: result.total,
        page,
        limit,
        totalPages,
        hasPrevious: page > 1,
        hasNext: page < totalPages,
      },
    };
  }
}
