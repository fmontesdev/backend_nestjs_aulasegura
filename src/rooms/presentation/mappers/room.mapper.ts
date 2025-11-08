import { RoomEntity } from '../../domain/entities/room.entity';
import { RoomResponse } from '../dto/responses/room.response.dto';
import { ReaderMapper } from '../../../readers/presentation/mappers/reader.mapper';

export class RoomMapper {
  /// Convierte una entidad Room a RoomResponse
  static toResponse(room: RoomEntity): RoomResponse {
    return {
      roomId: room.roomId,
      roomCode: room.roomCode,
      name: room.name,
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
}
