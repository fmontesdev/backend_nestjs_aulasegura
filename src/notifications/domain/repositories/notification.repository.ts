import { NotificationEntity, NotificationType } from '../entities/notification.entity';
import { NotificationRecipientEntity } from '../entities/notification-recipient.entity';

export abstract class NotificationRepository {
  abstract createAccessNotificationForUsers(
    type: NotificationType,
    title: string,
    body: string,
    userIds: string[],
  ): Promise<NotificationEntity>;

  abstract findLatestForUser(userId: string, limit: number): Promise<NotificationRecipientEntity[]>;
  abstract countUnreadForUser(userId: string): Promise<number>;
  abstract markAsReadForUser(notificationId: string, userId: string): Promise<NotificationRecipientEntity | null>;
}
