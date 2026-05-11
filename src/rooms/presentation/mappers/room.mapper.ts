import { RoomEntity } from '../../domain/entities/room.entity';
import { RoomResponse } from '../dto/responses/room.response.dto';
import { PaginatedRoomsResponse, PaginationMeta } from '../dto/responses/paginated-rooms.response.dto';
import { PaginatedResult } from '../../application/dto/find-rooms-filters.dto';
import { ReaderMapper } from '../../../readers/presentation/mappers/reader.mapper';

export class RoomMapper {
  /// Convierte una entidad Room a RoomResponse
  static toResponse(room: RoomEntity): RoomResponse {
    return {
      roomId: room.roomId,
      roomCode: room.roomCode,
      name: room.name,
      courseId: room.courseId,
      courseName: room.course ? room.course.name : null,
      capacity: room.capacity,
      building: room.building,
      floor: room.floor,
      readers: room.readers ? ReaderMapper.toSimpleResponseList(room.readers) : [],
    };
  }

  /// Convierte una lista de entidades Room a lista de RoomResponse
  static toResponseList(rooms: RoomEntity[]): RoomResponse[] {
    return rooms.map((room) => this.toResponse(room));
  }

  static toPaginationMeta(result: PaginatedResult<RoomEntity>): PaginationMeta {
    return {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasPrevious: result.page > 1,
      hasNext: result.page < result.totalPages,
    };
  }

  static toPaginatedResponse(result: PaginatedResult<RoomEntity>): PaginatedRoomsResponse {
    return {
      data: this.toResponseList(result.data),
      meta: this.toPaginationMeta(result),
    };
  }
}
