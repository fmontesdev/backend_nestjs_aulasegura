import { SubjectEntity } from '../../domain/entities/subject.entity';
import { SubjectResponse } from '../dto/responses/subject.response.dto';
import { PaginatedSubjectsResponse } from '../dto/responses/paginated-subjects.response.dto';
import { DepartmentMapper } from '../../../departments/presentation/mappers/department.mapper';
import { CourseMapper } from '../../../courses/presentation/mappers/course.mapper';

export class SubjectMapper {
  static toResponse(entity: SubjectEntity): SubjectResponse {
    return {
      subjectId: entity.subjectId,
      subjectCode: entity.subjectCode,
      name: entity.name,
      isActive: entity.isActive,
      department: DepartmentMapper.toSimpleResponse(entity.department),
      courses: entity.courses ? CourseMapper.toResponseList(entity.courses) : [],
    };
  }

  static toResponseList(entities: SubjectEntity[]): SubjectResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }

  // Métodos simplificados sin department para evitar recursión infinita

  static toSimpleResponse(entity: SubjectEntity): SubjectResponse {
    return {
      subjectId: entity.subjectId,
      subjectCode: entity.subjectCode,
      name: entity.name,
      isActive: entity.isActive,
      courses: entity.courses ? CourseMapper.toResponseList(entity.courses) : [],
    };
  }

  static toSimpleResponseList(entities: SubjectEntity[]): SubjectResponse[] {
    return entities.map((entity) => this.toSimpleResponse(entity));
  }

  static toPaginatedResponse(
    result: { data: SubjectEntity[]; total: number },
    page: number,
    limit: number,
  ): PaginatedSubjectsResponse {
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
      }
    };
  }
}
