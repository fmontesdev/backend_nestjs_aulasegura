import { AccessLogEntity } from '../../domain/entities/access-log.entity';
import { AccessLogResponse } from '../dto/responses/access-log.response.dto';
import { PaginatedAccessLogsResponse, PaginationMeta } from '../dto/responses/paginated-access-logs.response.dto';
import { PaginatedResult } from '../../application/dto/find-access-log-filters.dto';
import { UserMapper } from '../../../users/presentation/mappers/user.mapper';
import { RoomMapper } from '../../../rooms/presentation/mappers/room.mapper';
import { toMadridIsoString } from 'src/common/utils/madrid-timezone.util';

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
      createdAt: toMadridIsoString(entity.createdAt),
    };
  }

  static toResponseList(entities: AccessLogEntity[]): AccessLogResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }

  static toPaginationMeta(result: PaginatedResult<AccessLogEntity>): PaginationMeta {
    return {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasPrevious: result.page > 1,
      hasNext: result.page < result.totalPages,
    };
  }

  static toPaginatedResponse(result: PaginatedResult<AccessLogEntity>): PaginatedAccessLogsResponse {
    return {
      data: this.toResponseList(result.data),
      meta: this.toPaginationMeta(result),
    };
  }
}
