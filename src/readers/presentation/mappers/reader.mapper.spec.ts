import { ReaderEntity } from '../../domain/entities/reader.entity';
import { ReaderMapper } from './reader.mapper';

describe('ReaderMapper', () => {
  it('maps readers without an assigned room', () => {
    const reader = {
      readerId: 1,
      readerCode: 'READER-A101',
      roomId: null,
      room: null,
      isActive: true,
    } as ReaderEntity;

    expect(ReaderMapper.toResponse(reader)).toEqual({
      readerId: 1,
      readerCode: 'READER-A101',
      roomId: null,
      roomCode: undefined,
      roomName: undefined,
      isActive: true,
    });
  });
});
