import { PermissionEntity } from '../../domain/entities/permission.entity';
import { PermissionAssignmentResponse, PermissionResponse } from '../dto/responses/permission.response.dto';
import { UserMapper } from '../../../users/presentation/mappers/user.mapper';
import { RoomMapper } from '../../../rooms/presentation/mappers/room.mapper';
import { ScheduleMapper } from '../../../schedules/presentation/mappers/schedule.mapper';
import { toMadridIsoString } from 'src/common/utils/madrid-timezone.util';

export class PermissionMapper {
  /// Convierte una entidad Permission a PermissionResponse
  static toResponse(entity: PermissionEntity): PermissionResponse {
    return {
      user: UserMapper.toResponse(entity.user),
      room: RoomMapper.toResponse(entity.room),
      schedule: ScheduleMapper.toResponse(entity.schedule),
      assignment: this.toAssignmentResponse(entity),
      createdById: entity.createdById,
      createdAt: toMadridIsoString(entity.createdAt),
      isActive: entity.isActive,
    };
  }

  /// Convierte una lista de entidades Permission a lista de PermissionResponse
  static toResponseList(entities: PermissionEntity[]): PermissionResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }

  private static toAssignmentResponse(entity: PermissionEntity): PermissionAssignmentResponse | null {
    if (!entity.assignment) {
      return null;
    }

    return {
      assignmentId: entity.assignment.assignmentId,
      teacher: {
        userId: entity.assignment.teacher.userId,
        name: entity.assignment.teacher.user.name,
        lastname: entity.assignment.teacher.user.lastname,
        email: entity.assignment.teacher.user.email,
      },
      course: {
        courseId: entity.assignment.course.courseId,
        courseCode: entity.assignment.course.courseCode,
        name: entity.assignment.course.name,
      },
      subject: {
        subjectId: entity.assignment.subject.subjectId,
        subjectCode: entity.assignment.subject.subjectCode,
        name: entity.assignment.subject.name,
      },
      isActive: entity.assignment.isActive,
    };
  }
}
