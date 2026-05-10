import { RoleName } from '../../../users/domain/enums/rolename.enum';
import { NotificationType } from '../../domain/entities/notification.entity';

export enum NotificationTargetMode {
  USER = 'user',
  ROLE = 'role',
  ALL = 'all',
}

export interface CreateManualNotificationDto {
  type: NotificationType;
  title: string;
  body: string;
  target: {
    mode: NotificationTargetMode;
    userId?: string;
    roleName?: RoleName;
  };
}

export interface CreateManualNotificationResultDto {
  notificationId: string;
  createdRecipients: number;
}
