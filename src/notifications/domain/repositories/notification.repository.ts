import { NotificationEntity, NotificationType } from '../entities/notification.entity';
import { NotificationRecipientEntity } from '../entities/notification-recipient.entity';
import { FindNotificationsFiltersDto, PaginatedResult } from '../../application/dto/find-notifications-filters.dto';

export abstract class NotificationRepository {
  abstract createNotificationForUsers(
    type: NotificationType,
    title: string,
    body: string,
    userIds: string[],
  ): Promise<NotificationEntity>;

  abstract createAccessNotificationForUsers(
    type: NotificationType,
    title: string,
    body: string,
    userIds: string[],
  ): Promise<NotificationEntity>;

  abstract findAllForUser(userId: string, filters: FindNotificationsFiltersDto): Promise<PaginatedResult<NotificationRecipientEntity>>;
  abstract countUnreadForUser(userId: string): Promise<number>;
  abstract markAsReadForUser(notificationId: string, userId: string): Promise<NotificationRecipientEntity | null>;
  abstract markAllAsReadForUser(userId: string): Promise<number>;
}
