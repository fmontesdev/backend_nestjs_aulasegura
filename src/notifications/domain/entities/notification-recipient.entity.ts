import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { NotificationEntity } from './notification.entity';

@Entity({ name: 'notification_recipient' })
@Unique('uq_notification_recipient_user', ['notificationId', 'userId'])
export class NotificationRecipientEntity {
  @PrimaryGeneratedColumn({ name: 'notification_recipient_id', type: 'bigint' })
  notificationRecipientId!: string;

  @Column({ name: 'notification_id', type: 'bigint' })
  notificationId!: string;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId!: string;

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt!: Date | null;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => NotificationEntity, (notification) => notification.recipients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'notification_id', referencedColumnName: 'notificationId' })
  notification!: NotificationEntity;

  @ManyToOne(() => UserEntity, (user) => user.notificationRecipients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user!: UserEntity;
}
