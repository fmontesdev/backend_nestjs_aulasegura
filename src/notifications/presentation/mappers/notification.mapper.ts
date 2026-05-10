import { NotificationRecipientEntity } from '../../domain/entities/notification-recipient.entity';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationResponseDto } from '../dto/responses/notification.response.dto';

export class NotificationMapper {
  static toResponse(notification: NotificationEntity, readAt: Date | null): NotificationResponseDto {
    return {
      notificationId: notification.notificationId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      createdAt: notification.createdAt,
      readAt,
    };
  }

  static toResponseFromRecipient(recipient: NotificationRecipientEntity): NotificationResponseDto {
    return this.toResponse(recipient.notification, recipient.readAt);
  }

  static toResponseListFromRecipients(recipients: NotificationRecipientEntity[]): NotificationResponseDto[] {
    return recipients.map((recipient) => this.toResponseFromRecipient(recipient));
  }
}
