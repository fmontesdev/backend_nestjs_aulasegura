import { AccessLogEntity } from '../../domain/entities/access-log.entity';
import { AccessMethod } from '../../domain/enums/access-method.enum';
import { AccessStatus } from '../../domain/enums/access-status.enum';
import { AccessLogMapper } from './access-log.mapper';
import { RoomMapper } from '../../../rooms/presentation/mappers/room.mapper';
import { UserMapper } from '../../../users/presentation/mappers/user.mapper';

describe('AccessLogMapper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('incluye reasonStatus en la respuesta de logs', () => {
    jest.spyOn(UserMapper, 'toResponse').mockReturnValue({} as any);
    jest.spyOn(RoomMapper, 'toResponse').mockReturnValue({} as any);

    const entity = {
      accessLogId: 1,
      tagId: 10,
      user: {},
      readerId: 20,
      room: {},
      subjectId: null,
      accessMethod: AccessMethod.RFID,
      accessStatus: AccessStatus.ALLOWED,
      reasonStatus: 'Valid permission found',
      createdAt: new Date('2026-05-10T12:00:00.000Z'),
    } as AccessLogEntity;

    expect(AccessLogMapper.toResponse(entity)).toEqual(expect.objectContaining({
      reasonStatus: 'Valid permission found',
    }));
  });
});
