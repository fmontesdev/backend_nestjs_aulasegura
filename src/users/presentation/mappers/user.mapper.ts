import { UserEntity } from '../../domain/entities/user.entity';
import { UserCourseResponse, UserResponse } from '../dto/responses/user.response.dto';
import { PaginatedUsersResponse, PaginationMeta } from '../dto/responses/paginated-users.response.dto';
import { PaginatedResult } from '../../application/dto/find-users-filters.dto';
import { toMadridIsoString } from 'src/common/utils/madrid-timezone.util';
import { RoleName } from '../../domain/enums/rolename.enum';

export class UserMapper {
  static toResponse(user: UserEntity): UserResponse {
    return {
      userId: user.userId,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      avatar: user.avatar ?? null,
      roles: user.roles?.map(role => role.name) ?? [],
      validFrom: user.validFrom,
      validTo: user.validTo ?? null,
      createdAt: toMadridIsoString(user.createdAt),
      department: user.teacher?.department ?? null,
      courses: this.toTeacherCourses(user),
    };
  }

  private static toTeacherCourses(user: UserEntity): UserCourseResponse[] | null {
    const isTeacher = user.roles?.some(role => role.name === RoleName.TEACHER) ?? false;
    if (!isTeacher) {
      return null;
    }

    const coursesById = new Map<number, UserCourseResponse>();
    const assignments = user.teacher?.subjectCourseAssignments?.filter(assignment => assignment.isActive) ?? [];

    for (const assignment of assignments) {
      if (!assignment.course || !assignment.subject) {
        continue;
      }

      let course = coursesById.get(assignment.course.courseId);
      if (!course) {
        course = {
          courseId: assignment.course.courseId,
          courseCode: assignment.course.courseCode,
          name: assignment.course.name,
          subjects: [],
        };
        coursesById.set(assignment.course.courseId, course);
      }

      if (!course.subjects.some(subject => subject.subjectId === assignment.subject.subjectId)) {
        course.subjects.push({
          subjectId: assignment.subject.subjectId,
          subjectCode: assignment.subject.subjectCode,
          name: assignment.subject.name,
        });
      }
    }

    return Array.from(coursesById.values());
  }

  static toResponseList(entities: UserEntity[]): UserResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }

  static toPaginationMeta(result: PaginatedResult<UserEntity>): PaginationMeta {
    return {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasPrevious: result.page > 1,
      hasNext: result.page < result.totalPages,
    };
  }

  static toPaginatedResponse(result: PaginatedResult<UserEntity>): PaginatedUsersResponse {
    return {
      data: this.toResponseList(result.data),
      meta: this.toPaginationMeta(result),
    };
  }
}
