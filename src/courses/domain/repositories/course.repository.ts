import { CourseEntity } from '../entities/course.entity';

export abstract class CourseRepository {
  abstract findAll(): Promise<CourseEntity[]>;
  abstract findOneById(courseId: number): Promise<CourseEntity | null>;
  abstract findOneActiveById(courseId: number): Promise<CourseEntity | null>;
  abstract findOneByCourseCode(courseCode: string): Promise<CourseEntity | null>;
  abstract save(course: CourseEntity): Promise<CourseEntity>;
}
