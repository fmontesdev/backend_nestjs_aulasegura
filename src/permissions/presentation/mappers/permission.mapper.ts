import { PermissionEntity } from '../../domain/entities/permission.entity';
import { PermissionResponse } from '../dto/responses/permission.response.dto';
import { UserMapper } from '../../../users/presentation/mappers/user.mapper';
import { RoomMapper } from '../../../rooms/presentation/mappers/room.mapper';
import { ScheduleMapper } from '../../../schedules/presentation/mappers/schedule.mapper';

export class PermissionMapper {
  /// Convierte una entidad Permission a PermissionResponse
  static toResponse(entity: PermissionEntity): PermissionResponse {
    return {
      user: UserMapper.toResponse(entity.user),
      room: RoomMapper.toResponse(entity.room),
      schedule: ScheduleMapper.toResponse(entity.schedule),
      createdById: entity.createdById,
      createdAt: entity.createdAt,
      isActive: entity.isActive,
    };
  }

  /// Convierte una lista de entidades Permission a lista de PermissionResponse
  static toResponseList(entities: PermissionEntity[]): PermissionResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
