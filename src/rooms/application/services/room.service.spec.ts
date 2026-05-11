import { ConflictException, NotFoundException } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomRepository } from '../../domain/repositories/room.repository';
import { RoomEntity } from '../../domain/entities/room.entity';

describe('RoomService delete', () => {
  let service: RoomService;
  let roomRepository: jest.Mocked<RoomRepository>;

  const room = { roomId: 1, roomCode: 'A101' } as RoomEntity;

  beforeEach(() => {
    roomRepository = {
      findAll: jest.fn(),
      findAllWithFilters: jest.fn(),
      findOneById: jest.fn().mockResolvedValue(room),
      findOneByRoomCode: jest.fn(),
      hasPermissions: jest.fn().mockResolvedValue(false),
      hasAccessLogs: jest.fn().mockResolvedValue(false),
      detachReaders: jest.fn().mockResolvedValue(undefined),
      save: jest.fn(),
      delete: jest.fn().mockResolvedValue(undefined),
    };

    service = new RoomService(roomRepository, {} as any, {} as any);
  });

  it('throws 404 when the room does not exist', async () => {
    roomRepository.findOneById.mockResolvedValueOnce(null);

    await expect(service.delete(1)).rejects.toBeInstanceOf(NotFoundException);
    expect(roomRepository.detachReaders).not.toHaveBeenCalled();
    expect(roomRepository.delete).not.toHaveBeenCalled();
  });

  it('throws 409 when the room has permissions', async () => {
    roomRepository.hasPermissions.mockResolvedValueOnce(true);

    await expect(service.delete(1)).rejects.toBeInstanceOf(ConflictException);
    expect(roomRepository.detachReaders).not.toHaveBeenCalled();
    expect(roomRepository.delete).not.toHaveBeenCalled();
  });

  it('throws 409 when the room has access logs', async () => {
    roomRepository.hasAccessLogs.mockResolvedValueOnce(true);

    await expect(service.delete(1)).rejects.toBeInstanceOf(ConflictException);
    expect(roomRepository.detachReaders).not.toHaveBeenCalled();
    expect(roomRepository.delete).not.toHaveBeenCalled();
  });

  it('detaches readers before deleting the room', async () => {
    await service.delete(1);

    expect(roomRepository.detachReaders).toHaveBeenCalledWith(1);
    expect(roomRepository.delete).toHaveBeenCalledWith(1);
  });
});
