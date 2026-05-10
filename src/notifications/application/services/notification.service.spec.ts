import { AccessStatus } from '../../../access/domain/enums/access-status.enum';
import { NotificationType } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationEventEmitter } from './notification-event-emitter.service';
import { NotificationService } from './notification.service';
import { UsersService } from '../../../users/application/services/users.service';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

describe('NotificationService', () => {
  let repository: jest.Mocked<NotificationRepository>;
  let usersService: jest.Mocked<Pick<UsersService, 'findActiveUsersByRole'>>;
  let emitter: jest.Mocked<NotificationEventEmitter>;
  let service: NotificationService;

  beforeEach(() => {
    repository = {
      createAccessNotificationForUsers: jest.fn(),
      findLatestForUser: jest.fn(),
      countUnreadForUser: jest.fn(),
      markAsReadForUser: jest.fn(),
    } as unknown as jest.Mocked<NotificationRepository>;
    usersService = {
      findActiveUsersByRole: jest.fn(),
    } as unknown as jest.Mocked<Pick<UsersService, 'findActiveUsersByRole'>>;
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
});
