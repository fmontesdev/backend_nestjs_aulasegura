import { AccessLogEntity } from '../../domain/entities/access-log.entity';
import { AccessLogResponse } from '../dto/responses/access-log.response.dto';
import { UserMapper } from '../../../users/presentation/mappers/user.mapper';
import { RoomMapper } from '../../../rooms/presentation/mappers/room.mapper';

export class AccessLogMapper {
  static toResponse(entity: AccessLogEntity): AccessLogResponse {
    return {
      accessLogId: entity.accessLogId,
      tagId: entity.tagId,
      user: UserMapper.toResponse(entity.user),
      readerId: entity.readerId,
      room: RoomMapper.toResponse(entity.room),
      subjectId: entity.subjectId,
      accessMethod: entity.accessMethod,
      accessStatus: entity.accessStatus,
      createdAt: entity.createdAt,
    };
  }

  static toResponseList(entities: AccessLogEntity[]): AccessLogResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
