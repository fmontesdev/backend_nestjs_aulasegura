import { NotificationRecipientEntity } from '../../domain/entities/notification-recipient.entity';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { PaginatedResult } from '../../application/dto/find-notifications-filters.dto';
import { PaginatedNotificationsResponse, NotificationPaginationMeta } from '../dto/responses/paginated-notifications.response.dto';
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

  static toPaginationMeta(result: PaginatedResult<NotificationResponseDto>): NotificationPaginationMeta {
    return {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasPrevious: result.page > 1,
      hasNext: result.page < result.totalPages,
    };
  }

  static toPaginatedResponse(result: PaginatedResult<NotificationResponseDto>): PaginatedNotificationsResponse {
    return {
      data: result.data,
      meta: this.toPaginationMeta(result),
    };
  }
}
