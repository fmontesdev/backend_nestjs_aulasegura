import { RoomEntity } from '../entities/room.entity';
import { FindRoomsFiltersDto, PaginatedResult } from '../../application/dto/find-rooms-filters.dto';

export abstract class RoomRepository {
  abstract findAll(): Promise<RoomEntity[]>;
  abstract findAllWithFilters(filters: FindRoomsFiltersDto): Promise<PaginatedResult<RoomEntity>>;
  abstract findOneById(roomId: number): Promise<RoomEntity | null>;
  abstract findOneByRoomCode(roomCode: string): Promise<RoomEntity | null>;
  abstract hasPermissions(roomId: number): Promise<boolean>;
  abstract hasAccessLogs(roomId: number): Promise<boolean>;
  abstract detachReaders(roomId: number): Promise<void>;
  abstract save(room: RoomEntity): Promise<RoomEntity>;
  abstract delete(roomId: number): Promise<void>;
}
