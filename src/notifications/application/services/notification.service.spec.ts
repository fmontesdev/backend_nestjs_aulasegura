import { AccessStatus } from '../../../access/domain/enums/access-status.enum';
import { NotificationType } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationEventEmitter } from './notification-event-emitter.service';
import { NotificationService } from './notification.service';
import { UsersService } from '../../../users/application/services/users.service';
import { RoleName } from '../../../users/domain/enums/rolename.enum';
import { NotificationTargetMode } from '../dto/create-manual-notification.dto';

describe('NotificationService', () => {
  let repository: jest.Mocked<NotificationRepository>;
  let usersService: jest.Mocked<Pick<UsersService, 'findActiveUserById' | 'findActiveUsers' | 'findActiveUsersByRole'>>;
  let emitter: jest.Mocked<NotificationEventEmitter>;
  let service: NotificationService;

  beforeEach(() => {
    repository = {
      createNotificationForUsers: jest.fn(),
      createAccessNotificationForUsers: jest.fn(),
      findAllForUser: jest.fn(),
      countUnreadForUser: jest.fn(),
      markAsReadForUser: jest.fn(),
      markAllAsReadForUser: jest.fn(),
    } as unknown as jest.Mocked<NotificationRepository>;
    usersService = {
      findActiveUserById: jest.fn(),
      findActiveUsers: jest.fn(),
      findActiveUsersByRole: jest.fn(),
    } as unknown as jest.Mocked<Pick<UsersService, 'findActiveUserById' | 'findActiveUsers' | 'findActiveUsersByRole'>>;
    emitter = { emit: jest.fn(), asObservable: jest.fn() } as unknown as jest.Mocked<NotificationEventEmitter>;
    service = new NotificationService(repository, usersService as unknown as UsersService, emitter);
  });

  it('creates and emits an access notification for admin recipients when access is denied', async () => {
    usersService.findActiveUsersByRole.mockResolvedValue([{ userId: 'admin-1' }] as any);
    repository.createAccessNotificationForUsers.mockResolvedValue({
      notificationId: '10',
      type: NotificationType.ACCESS,
      title: 'Acceso denegado',
      body: 'Ada Lovelace no pudo acceder a Aula 1',
      createdAt: new Date('2026-05-10T10:00:00.000Z'),
      recipients: [{ userId: 'admin-1', readAt: null }],
    } as any);

    await service.createFromAccessLog({
      accessStatus: AccessStatus.DENIED,
      user: { name: 'Ada', lastname: 'Lovelace' },
      room: { name: 'Aula 1' },
    } as any);

    expect(usersService.findActiveUsersByRole).toHaveBeenCalledWith(RoleName.ADMIN);
    expect(repository.createAccessNotificationForUsers).toHaveBeenCalledWith(
      NotificationType.ACCESS,
      'Acceso denegado',
      'Ada Lovelace no pudo acceder a Aula 1',
      ['admin-1'],
    );
    expect(emitter.emit).toHaveBeenCalledWith(
      expect.objectContaining({ notificationId: '10', title: 'Acceso denegado', readAt: null }),
    );
  });

  it('creates timeout notifications with fallback names and does not create for allowed access', async () => {
    usersService.findActiveUsersByRole.mockResolvedValue([{ userId: 'admin-1' }] as any);
    repository.createAccessNotificationForUsers.mockResolvedValue({
      notificationId: '11',
      type: NotificationType.ACCESS,
      title: 'Acceso caducado',
      body: 'Usuario desconocido agotó el tiempo de acceso en Espacio desconocido',
      createdAt: new Date('2026-05-10T11:00:00.000Z'),
      recipients: [{ userId: 'admin-1', readAt: null }],
    } as any);

    await service.createFromAccessLog({ accessStatus: AccessStatus.TIMEOUT } as any);
    await service.createFromAccessLog({ accessStatus: AccessStatus.ALLOWED } as any);

    expect(repository.createAccessNotificationForUsers).toHaveBeenCalledTimes(1);
    expect(repository.createAccessNotificationForUsers).toHaveBeenCalledWith(
      NotificationType.ACCESS,
      'Acceso caducado',
      'Usuario desconocido agotó el tiempo de acceso en Espacio desconocido',
      ['admin-1'],
    );
  });

  it('returns paginated notifications for a user', async () => {
    repository.findAllForUser.mockResolvedValue({
      data: [
        {
          notification: {
            notificationId: '12',
            type: NotificationType.ACCESS,
            title: 'Acceso denegado',
            body: 'Ada no pudo acceder a Aula 1',
            createdAt: new Date('2026-05-10T10:00:00.000Z'),
          },
          readAt: null,
        },
      ],
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    } as any);

    const result = await service.findAllForUser('admin-1', { page: 1, limit: 5 });

    expect(repository.findAllForUser).toHaveBeenCalledWith('admin-1', { page: 1, limit: 5 });
    expect(result).toEqual({
      data: [expect.objectContaining({ notificationId: '12', readAt: null })],
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    });
  });

  it('passes read=false filter for unread notifications', async () => {
    repository.findAllForUser.mockResolvedValue({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 } as any);

    await service.findAllForUser('admin-1', { page: 1, limit: 20, read: false });

    expect(repository.findAllForUser).toHaveBeenCalledWith('admin-1', { page: 1, limit: 20, read: false });
  });

  it('passes read=true filter for read notifications', async () => {
    repository.findAllForUser.mockResolvedValue({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 } as any);

    await service.findAllForUser('admin-1', { page: 1, limit: 20, read: true });

    expect(repository.findAllForUser).toHaveBeenCalledWith('admin-1', { page: 1, limit: 20, read: true });
  });

  it('marks all unread notifications for the authenticated user', async () => {
    repository.markAllAsReadForUser.mockResolvedValue(3);

    await expect(service.markAllAsReadForUser('admin-1')).resolves.toEqual({ updated: 3 });
    expect(repository.markAllAsReadForUser).toHaveBeenCalledWith('admin-1');
  });

  it('is idempotent when there are no unread notifications', async () => {
    repository.markAllAsReadForUser.mockResolvedValue(0);

    await expect(service.markAllAsReadForUser('admin-1')).resolves.toEqual({ updated: 0 });
  });

  it('creates a manual notification for one active user', async () => {
    usersService.findActiveUserById.mockResolvedValue({ userId: 'user-1' } as any);
    repository.createNotificationForUsers.mockResolvedValue({
      notificationId: '20',
      type: NotificationType.WARNING,
      title: 'Mantenimiento programado',
      body: 'El sistema no estará disponible.',
      createdAt: new Date('2026-05-10T12:00:00.000Z'),
    } as any);

    await expect(
      service.createManualNotification({
        type: NotificationType.WARNING,
        title: 'Mantenimiento programado',
        body: 'El sistema no estará disponible.',
        target: { mode: NotificationTargetMode.USER, userId: 'user-1' },
      }),
    ).resolves.toEqual({ notificationId: '20', createdRecipients: 1 });

    expect(usersService.findActiveUserById).toHaveBeenCalledWith('user-1');
    expect(repository.createNotificationForUsers).toHaveBeenCalledWith(
      NotificationType.WARNING,
      'Mantenimiento programado',
      'El sistema no estará disponible.',
      ['user-1'],
    );
    expect(emitter.emit).toHaveBeenCalledWith(expect.objectContaining({ notificationId: '20', type: NotificationType.WARNING, readAt: null }));
  });

  it('fails when the target user does not exist or is inactive', async () => {
    usersService.findActiveUserById.mockResolvedValue(null);

    await expect(
      service.createManualNotification({
        type: NotificationType.WARNING,
        title: 'Aviso',
        body: 'Contenido',
        target: { mode: NotificationTargetMode.USER, userId: 'user-1' },
      }),
    ).rejects.toThrow('Notification target user not found or inactive');

    expect(repository.createNotificationForUsers).not.toHaveBeenCalled();
  });

  it('creates a manual notification for all active users in a role', async () => {
    usersService.findActiveUsersByRole.mockResolvedValue([{ userId: 'teacher-1' }, { userId: 'teacher-2' }] as any);
    repository.createNotificationForUsers.mockResolvedValue({
      notificationId: '21',
      type: NotificationType.INFO,
      title: 'Información',
      body: 'Contenido',
      createdAt: new Date('2026-05-10T12:00:00.000Z'),
    } as any);

    await service.createManualNotification({
      type: NotificationType.INFO,
      title: 'Información',
      body: 'Contenido',
      target: { mode: NotificationTargetMode.ROLE, roleName: RoleName.TEACHER },
    });

    expect(usersService.findActiveUsersByRole).toHaveBeenCalledWith(RoleName.TEACHER);
    expect(repository.createNotificationForUsers).toHaveBeenCalledWith(NotificationType.INFO, 'Información', 'Contenido', [
      'teacher-1',
      'teacher-2',
    ]);
  });

  it('creates a manual notification for all active users', async () => {
    usersService.findActiveUsers.mockResolvedValue([{ userId: 'user-1' }, { userId: 'user-2' }] as any);
    repository.createNotificationForUsers.mockResolvedValue({
      notificationId: '22',
      type: NotificationType.WARNING,
      title: 'Aviso',
      body: 'Contenido',
      createdAt: new Date('2026-05-10T12:00:00.000Z'),
    } as any);

    await service.createManualNotification({
      type: NotificationType.WARNING,
      title: 'Aviso',
      body: 'Contenido',
      target: { mode: NotificationTargetMode.ALL },
    });

    expect(usersService.findActiveUsers).toHaveBeenCalled();
    expect(repository.createNotificationForUsers).toHaveBeenCalledWith(NotificationType.WARNING, 'Aviso', 'Contenido', ['user-1', 'user-2']);
  });

  it('removes duplicated recipients before creating manual notifications', async () => {
    usersService.findActiveUsersByRole.mockResolvedValue([{ userId: 'user-1' }, { userId: 'user-1' }, { userId: 'user-2' }] as any);
    repository.createNotificationForUsers.mockResolvedValue({
      notificationId: '23',
      type: NotificationType.WARNING,
      title: 'Aviso',
      body: 'Contenido',
      createdAt: new Date('2026-05-10T12:00:00.000Z'),
    } as any);

    const result = await service.createManualNotification({
      type: NotificationType.WARNING,
      title: 'Aviso',
      body: 'Contenido',
      target: { mode: NotificationTargetMode.ROLE, roleName: RoleName.TEACHER },
    });

    expect(result.createdRecipients).toBe(2);
    expect(repository.createNotificationForUsers).toHaveBeenCalledWith(NotificationType.WARNING, 'Aviso', 'Contenido', ['user-1', 'user-2']);
  });

  it('rejects invalid manual notification targets', async () => {
    await expect(
      service.createManualNotification({
        type: NotificationType.WARNING,
        title: 'Aviso',
        body: 'Contenido',
        target: { mode: NotificationTargetMode.ALL, userId: 'user-1' },
      }),
    ).rejects.toThrow('target.userId and target.roleName are not allowed when target.mode is all');
  });
});
