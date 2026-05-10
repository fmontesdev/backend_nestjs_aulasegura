import { AccessService } from './access.service';
import { AccessLogEntity } from '../../domain/entities/access-log.entity';
import { AccessMethod } from '../../domain/enums/access-method.enum';
import { AccessStatus } from '../../domain/enums/access-status.enum';

describe('AccessService reasonStatus persistence', () => {
  const createService = () => {
    let savedAccessLog: AccessLogEntity;

    const accessLogRepository = {
      findAll: jest.fn(),
      getAnalyticsSummary: jest.fn(),
      findOneById: jest.fn(async () => savedAccessLog),
      save: jest.fn(async (accessLog: AccessLogEntity) => {
        savedAccessLog = { ...accessLog, accessLogId: 1 } as AccessLogEntity;
        return savedAccessLog;
      }),
    };

    const tagService = {
      findOneByTagCode: jest.fn(async () => ({ tagId: 10, userId: 'user-1', isActive: true })),
    };

    const readerService = {
      findOneByReaderCode: jest.fn(async () => ({ readerId: 20, roomId: 30, isActive: true })),
    };

    const permissionService = {
      activePermissionAtCurrentTime: jest.fn(),
    };

    const configService = {
      get: jest.fn(() => 'test-pepper'),
    };

    const accessEventEmitter = {
      emit: jest.fn(),
    };

    const notificationService = {
      createFromAccessLog: jest.fn(),
    };

    const service = new AccessService(
      accessLogRepository as any,
      tagService as any,
      readerService as any,
      permissionService as any,
      configService as any,
      accessEventEmitter as any,
      notificationService as any,
    );

    return { accessLogRepository, permissionService, service };
  };

  it('guarda "No valid permission found" cuando el acceso se deniega por falta de permiso', async () => {
    const { accessLogRepository, permissionService, service } = createService();
    permissionService.activePermissionAtCurrentTime.mockResolvedValue(null);

    await service.rfidNfcAccessCheck({ accessMethod: AccessMethod.RFID, rawUid: 'raw-uid', readerCode: 'reader-1' }, { userId: 'user-1' });

    expect(accessLogRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      accessStatus: AccessStatus.DENIED,
      reasonStatus: 'No valid permission found',
    }));
  });

  it('guarda "Valid permission found" cuando el acceso es permitido', async () => {
    const { accessLogRepository, permissionService, service } = createService();
    permissionService.activePermissionAtCurrentTime.mockResolvedValue({ permissionId: 1 });

    await service.rfidNfcAccessCheck({ accessMethod: AccessMethod.RFID, rawUid: 'raw-uid', readerCode: 'reader-1' }, { userId: 'user-1' });

    expect(accessLogRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      accessStatus: AccessStatus.ALLOWED,
      reasonStatus: 'Valid permission found',
    }));
  });
});
