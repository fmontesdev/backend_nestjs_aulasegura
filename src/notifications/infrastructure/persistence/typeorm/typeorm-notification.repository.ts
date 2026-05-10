import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, IsNull, Not, Repository } from 'typeorm';
import { FindNotificationsFiltersDto, PaginatedResult } from '../../../application/dto/find-notifications-filters.dto';
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
    return this.createNotificationForUsers(type, title, body, userIds);
  }

  async createNotificationForUsers(
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

  async findAllForUser(
    userId: string,
    filters: FindNotificationsFiltersDto,
  ): Promise<PaginatedResult<NotificationRecipientEntity>> {
    const page = filters.page;
    const limit = filters.limit;
    const where: { userId: string; readAt?: FindOperator<Date> } = { userId };

    if (filters.read === false) {
      where.readAt = IsNull();
    }

    if (filters.read === true) {
      where.readAt = Not(IsNull());
    }

    const [data, total] = await this.recipientRepo.findAndCount({
      where,
      relations: ['notification'],
      order: { notification: { createdAt: 'DESC' } },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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

  async markAllAsReadForUser(userId: string): Promise<number> {
    const result = await this.recipientRepo.update({ userId, readAt: IsNull() }, { readAt: new Date() });
    return result.affected ?? 0;
  }
}
