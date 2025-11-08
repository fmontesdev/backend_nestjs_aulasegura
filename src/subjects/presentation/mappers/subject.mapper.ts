import { SubjectEntity } from '../../domain/entities/subject.entity';
import { SubjectResponse } from '../dto/responses/subject.response.dto';
import { DepartmentMapper } from './department.mapper';
import { CourseMapper } from '../../../courses/presentation/mappers/course.mapper';

export class SubjectMapper {
  static toResponse(entity: SubjectEntity): SubjectResponse {
    return {
      subjectId: entity.subjectId,
      subjectCode: entity.subjectCode,
      name: entity.name,
      isActive: entity.isActive,
      department: DepartmentMapper.toResponse(entity.department),
      courses: entity.courses ? CourseMapper.toResponseList(entity.courses) : [],
    };
  }

  static toResponseList(entities: SubjectEntity[]): SubjectResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
