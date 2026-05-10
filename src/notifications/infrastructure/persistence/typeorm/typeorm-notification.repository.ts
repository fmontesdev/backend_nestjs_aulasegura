import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { NotificationRecipientEntity } from '../../../domain/entities/notification-recipient.entity';
import { NotificationEntity, NotificationType } from '../../../domain/entities/notification.entity';
import { NotificationRepository } from '../../../domain/repositories/notification.repository';

@Injectable()
export class TypeormNotificationRepository implements NotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
    @InjectRepository(NotificationRecipientEntity)
    private readonly recipientRepo: Repository<NotificationRecipientEntity>,
  ) {}

  async createAccessNotificationForUsers(
    type: NotificationType,
    title: string,
    body: string,
    userIds: string[],
  ): Promise<NotificationEntity> {
    const notification = await this.notificationRepo.save(this.notificationRepo.create({ type, title, body }));
    const recipients = userIds.map((userId) => this.recipientRepo.create({ notificationId: notification.notificationId, userId, readAt: null }));
    notification.recipients = await this.recipientRepo.save(recipients);
    return notification;
  }

  async findLatestForUser(userId: string, limit: number): Promise<NotificationRecipientEntity[]> {
    return this.recipientRepo.find({
      where: { userId },
      relations: ['notification'],
      order: { notification: { createdAt: 'DESC' } },
      take: limit,
    });
  }

  async countUnreadForUser(userId: string): Promise<number> {
    return this.recipientRepo.count({ where: { userId, readAt: IsNull() } });
  }

  async markAsReadForUser(notificationId: string, userId: string): Promise<NotificationRecipientEntity | null> {
    const recipient = await this.recipientRepo.findOne({
      where: { notificationId, userId },
      relations: ['notification'],
    });
    if (!recipient) return null;
    if (!recipient.readAt) {
      recipient.readAt = new Date();
      await this.recipientRepo.save(recipient);
    }
    return recipient;
  }
}
