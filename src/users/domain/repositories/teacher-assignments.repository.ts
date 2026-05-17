import { CourseEntity } from '../../../courses/domain/entities/course.entity';
import { SubjectEntity } from '../../../subjects/domain/entities/subject.entity';
import { FindTeacherAssignmentsFiltersDto, PaginatedResult } from '../../application/dto/find-teacher-assignments-filters.dto';
import { TeacherEntity } from '../entities/teacher.entity';
import { TeacherSubjectCourseEntity } from '../entities/teacher-subject-course.entity';

export abstract class TeacherAssignmentsRepository {
  abstract findTeacherByUserId(userId: string): Promise<TeacherEntity | null>;
  abstract findCourseById(courseId: number): Promise<CourseEntity | null>;
  abstract findSubjectById(subjectId: number): Promise<SubjectEntity | null>;
  abstract existsCourseSubject(courseId: number, subjectId: number): Promise<boolean>;
  abstract findAllWithFilters(filters: FindTeacherAssignmentsFiltersDto): Promise<PaginatedResult<TeacherSubjectCourseEntity>>;
  abstract findByTeacherId(userId: string): Promise<TeacherSubjectCourseEntity[]>;
  abstract findByAssignmentId(assignmentId: number): Promise<TeacherSubjectCourseEntity | null>;
  abstract findOne(userId: string, courseId: number, subjectId: number): Promise<TeacherSubjectCourseEntity | null>;
  abstract save(assignment: TeacherSubjectCourseEntity): Promise<TeacherSubjectCourseEntity>;
  abstract softDeleteByAssignmentId(assignmentId: number): Promise<void>;
}
