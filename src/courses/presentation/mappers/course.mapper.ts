import { CourseEntity } from '../../domain/entities/course.entity';
import { CourseResponse } from '../dto/responses/course.response.dto';
import { AcademicYearMapper } from '../../../academic-year/presentation/mappers/academic-year.mapper';

export class CourseMapper {
  static toResponse(entity: CourseEntity): CourseResponse {
    return {
      courseId: entity.courseId,
      courseCode: entity.courseCode,
      name: entity.name,
      educationStage: entity.educationStage,
      levelNumber: entity.levelNumber,
      cfLevel: entity.cfLevel,
      isActive: entity.isActive,
      academicYears: entity.academicYears ? AcademicYearMapper.toResponseList(entity.academicYears) : [],
    };
  }

  static toResponseList(entities: CourseEntity[]): CourseResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
