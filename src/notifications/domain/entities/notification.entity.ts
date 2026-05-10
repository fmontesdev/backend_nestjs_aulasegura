import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationRecipientEntity } from './notification-recipient.entity';

export enum NotificationType {
  ACCESS = 'access',
  WARNING = 'warning',
  ALERT = 'alert',
}

@Entity({ name: 'notification' })
export class NotificationEntity {
  @PrimaryGeneratedColumn({ name: 'notification_id', type: 'bigint' })
  notificationId!: string;

  @Column({ name: 'type', type: 'enum', enum: NotificationType })
  type!: NotificationType;

  @Column({ name: 'title', type: 'varchar', length: 100 })
  title!: string;

  @Column({ name: 'body', type: 'varchar', length: 255 })
  body!: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @OneToMany(() => NotificationRecipientEntity, (recipient) => recipient.notification)
  recipients!: NotificationRecipientEntity[];
}
