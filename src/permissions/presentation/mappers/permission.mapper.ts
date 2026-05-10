import { PermissionEntity } from '../../domain/entities/permission.entity';
import { PermissionResponse } from '../dto/responses/permission.response.dto';
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
      createdById: entity.createdById,
      createdAt: toMadridIsoString(entity.createdAt),
      isActive: entity.isActive,
    };
  }

  /// Convierte una lista de entidades Permission a lista de PermissionResponse
  static toResponseList(entities: PermissionEntity[]): PermissionResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
