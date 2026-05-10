import { Injectable, NotFoundException } from '@nestjs/common';
import { AccessLogEntity } from '../../../access/domain/entities/access-log.entity';
import { AccessStatus } from '../../../access/domain/enums/access-status.enum';
import { UsersService } from '../../../users/application/services/users.service';
import { RoleName } from '../../../users/domain/enums/rolename.enum';
import { NotificationType } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationMapper } from '../../presentation/mappers/notification.mapper';
import { NotificationEventEmitter } from './notification-event-emitter.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly usersService: UsersService,
    private readonly notificationEventEmitter: NotificationEventEmitter,
  ) {}

  async createFromAccessLog(accessLog: AccessLogEntity): Promise<void> {
    const content = this.buildAccessNotificationContent(accessLog);
    if (!content) return;

    const admins = await this.usersService.findActiveUsersByRole(RoleName.ADMIN);
    const adminIds = admins.map((admin) => admin.userId);
    if (adminIds.length === 0) return;

    const notification = await this.notificationRepository.createAccessNotificationForUsers(
      NotificationType.ACCESS,
      content.title,
      content.body,
      adminIds,
    );

    this.notificationEventEmitter.emit(NotificationMapper.toResponse(notification, null));
  }

  async findLatestForUser(userId: string): Promise<ReturnType<typeof NotificationMapper.toResponseListFromRecipients>> {
    const recipients = await this.notificationRepository.findLatestForUser(userId, 50);
    return NotificationMapper.toResponseListFromRecipients(recipients);
  }

  async countUnreadForUser(userId: string): Promise<number> {
    return this.notificationRepository.countUnreadForUser(userId);
  }

  async markAsReadForUser(notificationId: string, userId: string) {
    const recipient = await this.notificationRepository.markAsReadForUser(notificationId, userId);
    if (!recipient) {
      throw new NotFoundException('Notification not found');
    }
    return NotificationMapper.toResponseFromRecipient(recipient);
  }

  private buildAccessNotificationContent(accessLog: AccessLogEntity): { title: string; body: string } | null {
    const userName = this.resolveUserName(accessLog);
    const roomName = accessLog.room?.name || 'Espacio desconocido';

    if (accessLog.accessStatus === AccessStatus.DENIED) {
      return {
        title: 'Acceso denegado',
        body: this.truncateBody(`${userName} no pudo acceder a ${roomName}`),
      };
    }

    if (accessLog.accessStatus === AccessStatus.TIMEOUT) {
      return {
        title: 'Acceso caducado',
        body: this.truncateBody(`${userName} agotó el tiempo de acceso en ${roomName}`),
      };
    }

    return null;
  }

  private resolveUserName(accessLog: AccessLogEntity): string {
    const name = accessLog.user?.name?.trim();
    const lastname = accessLog.user?.lastname?.trim();
    const fullName = [name, lastname].filter(Boolean).join(' ');
    return fullName || 'Usuario desconocido';
  }

  private truncateBody(body: string): string {
    return body.length > 255 ? body.slice(0, 255) : body;
  }
}
