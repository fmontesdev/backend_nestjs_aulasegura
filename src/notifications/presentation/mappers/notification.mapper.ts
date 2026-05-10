import { NotificationRecipientEntity } from '../../domain/entities/notification-recipient.entity';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationResponseDto } from '../dto/responses/notification.response.dto';
import { toMadridIsoString } from 'src/common/utils/madrid-timezone.util';

export class NotificationMapper {
  static toResponse(notification: NotificationEntity, readAt: Date | null): NotificationResponseDto {
    return {
      notificationId: notification.notificationId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      createdAt: toMadridIsoString(notification.createdAt),
      readAt: readAt ? toMadridIsoString(readAt) : null,
    };
  }

  static toResponseFromRecipient(recipient: NotificationRecipientEntity): NotificationResponseDto {
    return this.toResponse(recipient.notification, recipient.readAt);
  }

  static toResponseListFromRecipients(recipients: NotificationRecipientEntity[]): NotificationResponseDto[] {
    return recipients.map((recipient) => this.toResponseFromRecipient(recipient));
  }
}
