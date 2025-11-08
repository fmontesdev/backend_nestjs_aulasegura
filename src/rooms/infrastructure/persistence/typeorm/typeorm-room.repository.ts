import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../../../domain/entities/room.entity';
import { RoomRepository } from '../../../domain/repositories/room.repository';

@Injectable()
export class TypeOrmRoomRepository implements RoomRepository {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly repository: Repository<RoomEntity>,
  ) {}

  async findAll(): Promise<RoomEntity[]> {
    return this.repository.find({
      relations: ['course', 'readers'],
      order: { roomId: 'ASC' },
    });
  }

  async findOneById(roomId: number): Promise<RoomEntity | null> {
    return this.repository.findOne({
      where: { roomId },
      relations: ['course', 'readers'],
    });
  }

  async findOneByRoomCode(roomCode: string): Promise<RoomEntity | null> {
    return this.repository.findOne({
      where: { roomCode },
    });
  }

  async save(room: RoomEntity): Promise<RoomEntity> {
    return this.repository.save(room);
  }

  async delete(roomId: number): Promise<void> {
    await this.repository.delete(roomId);
  }
}
