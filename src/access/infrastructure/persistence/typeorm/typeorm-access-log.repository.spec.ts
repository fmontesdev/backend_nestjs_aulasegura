import { TypeOrmAccessLogRepository } from './typeorm-access-log.repository';
import { AccessAnalyticsDateFilter } from '../../../application/dto/access-analytics-summary.dto';
import { AccessLogEntity } from '../../../domain/entities/access-log.entity';
import { AccessMethod } from '../../../domain/enums/access-method.enum';
import { AccessStatus } from '../../../domain/enums/access-status.enum';
import { RoleName } from '../../../../users/domain/enums/rolename.enum';

describe('TypeOrmAccessLogRepository analytics summary', () => {
  const createRepositoryWithQueryBuilder = (logs: AccessLogEntity[]) => {
    const queryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(logs),
    };

    const repository = new TypeOrmAccessLogRepository({
      createQueryBuilder: jest.fn(() => queryBuilder),
    } as any);

    return { repository, queryBuilder };
  };

  const createRepository = (logs: AccessLogEntity[]) => createRepositoryWithQueryBuilder(logs).repository;

  const createLog = (overrides: Partial<AccessLogEntity>): AccessLogEntity => ({
    accessLogId: 1,
    tagId: null,
    userId: 'user-1',
    readerId: 1,
    roomId: 1,
    subjectId: null,
    accessMethod: AccessMethod.RFID,
    accessStatus: AccessStatus.ALLOWED,
    reasonStatus: null,
    createdAt: new Date('2026-05-10T06:00:00.000Z'),
    tag: null as any,
    user: {
      userId: 'user-1',
      name: 'Juan',
      lastname: 'Pérez',
      email: 'juan@demo.com',
      avatar: null,
      roles: [{ name: RoleName.TEACHER }],
    } as any,
    reader: null as any,
    room: {
      roomId: 1,
      roomCode: 'Aula 1',
      name: 'Aula 1',
      building: 1,
      floor: 0,
    } as any,
    subject: null,
    ...overrides,
  });

  it('calcula totalAccesses, allowedAccesses, deniedAccesses y denialRate', async () => {
    const repository = createRepository([
      createLog({ accessStatus: AccessStatus.ALLOWED }),
      createLog({ accessStatus: AccessStatus.ALLOWED }),
      createLog({ accessStatus: AccessStatus.DENIED }),
    ]);

    const summary = await repository.getAnalyticsSummary(AccessAnalyticsDateFilter.TODAY, 5);

    expect(summary.kpis).toEqual({
      totalAccesses: 3,
      allowedAccesses: 2,
      deniedAccesses: 1,
      denialRate: 33.3,
    });
  });

  it('agrupa y ordena topDeniedRooms por denegaciones descendentes', async () => {
    const repository = createRepository([
      createLog({ accessStatus: AccessStatus.DENIED, room: { roomId: 2, roomCode: 'Aula 2', name: 'Aula 2', building: 2, floor: 1 } as any }),
      createLog({ accessStatus: AccessStatus.DENIED, room: { roomId: 1, roomCode: 'Aula 1', name: 'Aula 1', building: 1, floor: 0 } as any }),
      createLog({ accessStatus: AccessStatus.DENIED, room: { roomId: 1, roomCode: 'Aula 1', name: 'Aula 1', building: 1, floor: 0 } as any }),
    ]);

    const summary = await repository.getAnalyticsSummary(AccessAnalyticsDateFilter.TODAY, 5);

    expect(summary.topDeniedRooms).toEqual([
      { roomId: 1, roomCode: 'Aula 1', roomName: 'Aula 1', building: 1, floor: 0, deniedCount: 2 },
      { roomId: 2, roomCode: 'Aula 2', roomName: 'Aula 2', building: 2, floor: 1, deniedCount: 1 },
    ]);
  });

  it('agrupa y ordena topDeniedUsers por denegaciones descendentes', async () => {
    const repository = createRepository([
      createLog({ accessStatus: AccessStatus.DENIED, user: { userId: 'user-2', name: 'Ana', lastname: 'Ruiz', email: 'ana@demo.com', avatar: 'avatar.png', roles: [{ name: RoleName.ADMIN }] } as any }),
      createLog({ accessStatus: AccessStatus.DENIED, user: { userId: 'user-1', name: 'Juan', lastname: 'Pérez', email: 'juan@demo.com', avatar: null, roles: [{ name: RoleName.TEACHER }, { name: RoleName.SUPPORT_STAFF }] } as any }),
      createLog({ accessStatus: AccessStatus.DENIED, user: { userId: 'user-1', name: 'Juan', lastname: 'Pérez', email: 'juan@demo.com', avatar: null, roles: [{ name: RoleName.TEACHER }, { name: RoleName.SUPPORT_STAFF }] } as any }),
    ]);

    const summary = await repository.getAnalyticsSummary(AccessAnalyticsDateFilter.TODAY, 5);

    expect(summary.topDeniedUsers).toEqual([
      { userId: 'user-1', name: 'Juan', lastname: 'Pérez', email: 'juan@demo.com', avatar: null, roles: [RoleName.TEACHER, RoleName.SUPPORT_STAFF], deniedCount: 2 },
      { userId: 'user-2', name: 'Ana', lastname: 'Ruiz', email: 'ana@demo.com', avatar: 'avatar.png', roles: [RoleName.ADMIN], deniedCount: 1 },
    ]);
  });

  it('cuenta allowed, denied, timeout y exit en hourlyActivity y total incluye todos los estados', async () => {
    const repository = createRepository([
      createLog({ accessStatus: AccessStatus.ALLOWED, createdAt: new Date('2026-05-10T06:00:00.000Z') }),
      createLog({ accessStatus: AccessStatus.DENIED, createdAt: new Date('2026-05-10T06:30:00.000Z') }),
      createLog({ accessStatus: AccessStatus.TIMEOUT, createdAt: new Date('2026-05-10T06:45:00.000Z') }),
      createLog({ accessStatus: AccessStatus.EXIT, createdAt: new Date('2026-05-10T06:50:00.000Z') }),
    ]);

    const summary = await repository.getAnalyticsSummary(AccessAnalyticsDateFilter.TODAY, 5);

    expect(summary.kpis.totalAccesses).toBe(4);
    expect(summary.hourlyActivity).toHaveLength(24);
    expect(summary.hourlyActivity[8]).toEqual({ hour: 8, total: 4, allowed: 1, denied: 1, timeout: 1, exit: 1 });
  });

  it('devuelve horas sin datos con todos los campos a cero', async () => {
    const repository = createRepository([
      createLog({ accessStatus: AccessStatus.ALLOWED, createdAt: new Date('2026-05-10T06:00:00.000Z') }),
    ]);

    const summary = await repository.getAnalyticsSummary(AccessAnalyticsDateFilter.TODAY, 5);

    expect(summary.hourlyActivity[0]).toEqual({ hour: 0, total: 0, allowed: 0, denied: 0, timeout: 0, exit: 0 });
  });

  it('devuelve denialRate 0 y rankings vacíos cuando no hay logs', async () => {
    const repository = createRepository([]);

    const summary = await repository.getAnalyticsSummary(AccessAnalyticsDateFilter.TODAY, 5);

    expect(summary.kpis).toEqual({
      totalAccesses: 0,
      allowedAccesses: 0,
      deniedAccesses: 0,
      denialRate: 0,
    });
    expect(summary.topDeniedRooms).toEqual([]);
    expect(summary.topDeniedUsers).toEqual([]);
  });

  it('filtra week como una ventana móvil de los últimos 7 días', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-05-11T10:30:00.000Z'));
    const { repository, queryBuilder } = createRepositoryWithQueryBuilder([]);

    await repository.getAnalyticsSummary(AccessAnalyticsDateFilter.WEEK, 5);

    expect(queryBuilder.where).toHaveBeenCalledWith('accessLog.createdAt >= :startDate AND accessLog.createdAt < :endDate', {
      startDate: new Date('2026-05-04T10:30:00.000Z'),
      endDate: new Date('2026-05-11T10:30:00.000Z'),
    });
    jest.useRealTimers();
  });

  it('filtra month como una ventana móvil de los últimos 30 días', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-05-11T10:30:00.000Z'));
    const { repository, queryBuilder } = createRepositoryWithQueryBuilder([]);

    await repository.getAnalyticsSummary(AccessAnalyticsDateFilter.MONTH, 5);

    expect(queryBuilder.where).toHaveBeenCalledWith('accessLog.createdAt >= :startDate AND accessLog.createdAt < :endDate', {
      startDate: new Date('2026-04-11T10:30:00.000Z'),
      endDate: new Date('2026-05-11T10:30:00.000Z'),
    });
    jest.useRealTimers();
  });
});
