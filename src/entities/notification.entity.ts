import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { UserEntity } from '../users/domain/entities/user.entity';

export enum NotificationType {
  ACCESS = 'access',
  WARNING = 'warning',
  ALERT = 'alert',
}

@Entity({ name: 'notification' })
export class NotificationEntity {
  @PrimaryGeneratedColumn({ name: 'notification_id', type: 'bigint' })
  notificationId!: string; // bigint → string (JS no precisa)

  @Column({ name: 'type', type: 'enum', enum: NotificationType })
  type!: NotificationType;

  @Column({ name: 'title', type: 'varchar', length: 100 })
  title!: string;

  @Column({ name: 'body', type: 'varchar', length: 255 })
  body!: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToMany(() => UserEntity, (u) => u.notifications)
  users!: UserEntity[];
}
