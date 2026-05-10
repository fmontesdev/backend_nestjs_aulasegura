import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AccessLogEntity } from '../../../access/domain/entities/access-log.entity';
import { AccessStatus } from '../../../access/domain/enums/access-status.enum';
import { UsersService } from '../../../users/application/services/users.service';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { RoleName } from '../../../users/domain/enums/rolename.enum';
import { NotificationType } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { CreateManualNotificationDto, CreateManualNotificationResultDto, NotificationTargetMode } from '../dto/create-manual-notification.dto';
import { FindNotificationsFiltersDto, PaginatedResult } from '../dto/find-notifications-filters.dto';
import { NotificationResponseDto } from '../../presentation/dto/responses/notification.response.dto';
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

  async createManualNotification(dto: CreateManualNotificationDto): Promise<CreateManualNotificationResultDto> {
    const recipients = await this.resolveManualRecipients(dto.target);
    const uniqueUserIds = [...new Set(recipients.map((user) => user.userId))];

    if (uniqueUserIds.length === 0) {
      throw new NotFoundException('No valid notification recipients found');
    }

    const notification = await this.notificationRepository.createNotificationForUsers(
      dto.type,
      dto.title,
      dto.body,
      uniqueUserIds,
    );

    this.notificationEventEmitter.emit(NotificationMapper.toResponse(notification, null));

    return {
      notificationId: notification.notificationId,
      createdRecipients: uniqueUserIds.length,
    };
  }

  async findAllForUser(userId: string, filters: FindNotificationsFiltersDto): Promise<PaginatedResult<NotificationResponseDto>> {
    const result = await this.notificationRepository.findAllForUser(userId, filters);

    return {
      ...result,
      data: NotificationMapper.toResponseListFromRecipients(result.data),
    };
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

  async markAllAsReadForUser(userId: string): Promise<{ updated: number }> {
    const updated = await this.notificationRepository.markAllAsReadForUser(userId);
    return { updated };
  }

  private async resolveManualRecipients(target: CreateManualNotificationDto['target']): Promise<UserEntity[]> {
    if (target.mode === NotificationTargetMode.USER) {
      if (!target.userId) {
        throw new BadRequestException('target.userId is required when target.mode is user');
      }

      const user = await this.usersService.findActiveUserById(target.userId);
      if (!user) {
        throw new NotFoundException('Notification target user not found or inactive');
      }

      return [user];
    }

    if (target.mode === NotificationTargetMode.ROLE) {
      if (!target.roleName) {
        throw new BadRequestException('target.roleName is required when target.mode is role');
      }

      return this.usersService.findActiveUsersByRole(target.roleName);
    }

    if (target.mode === NotificationTargetMode.ALL) {
      if (target.userId || target.roleName) {
        throw new BadRequestException('target.userId and target.roleName are not allowed when target.mode is all');
      }

      return this.usersService.findActiveUsers();
    }

    throw new BadRequestException('Invalid notification target mode');
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
