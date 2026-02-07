import { CourseEntity } from '../entities/course.entity';
import { FindCoursesFiltersDto } from '../../application/dto/find-courses-filters.dto';

export abstract class CourseRepository {
  abstract findAllWithFilters(filters: FindCoursesFiltersDto): Promise<{ data: CourseEntity[]; total: number }>;
  abstract findOneById(courseId: number): Promise<CourseEntity | null>;
  abstract findOneActiveById(courseId: number): Promise<CourseEntity | null>;
  abstract findOneByCourseCode(courseCode: string): Promise<CourseEntity | null>;
  abstract save(course: CourseEntity): Promise<CourseEntity>;
}
