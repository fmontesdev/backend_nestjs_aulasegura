import { CourseEntity } from '../../domain/entities/course.entity';
import { CourseResponse } from '../dto/responses/course.response.dto';
import { PaginatedCoursesResponse } from '../dto/responses/paginated-courses.response.dto';
import { AcademicYearMapper } from '../../../academic-years/presentation/mappers/academic-year.mapper';

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

  static toPaginatedResponse(result: { data: CourseEntity[]; total: number }, page: number, limit: number): PaginatedCoursesResponse {
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
