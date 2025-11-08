import { RoomEntity } from '../entities/room.entity';

export abstract class RoomRepository {
  abstract findAll(): Promise<RoomEntity[]>;
  abstract findOneById(roomId: number): Promise<RoomEntity | null>;
  abstract findOneByRoomCode(roomCode: string): Promise<RoomEntity | null>;
  abstract save(room: RoomEntity): Promise<RoomEntity>;
  abstract delete(roomId: number): Promise<void>;
}
