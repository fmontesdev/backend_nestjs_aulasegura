import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { IsNull } from 'typeorm';
import { NotificationRecipientEntity } from '../../../domain/entities/notification-recipient.entity';
import { NotificationEntity, NotificationType } from '../../../domain/entities/notification.entity';
import { TypeormNotificationRepository } from './typeorm-notification.repository';

describe('TypeormNotificationRepository', () => {
  let repository: TypeormNotificationRepository;
  let recipientRepo: {
    findAndCount: jest.Mock;
    count: jest.Mock;
    findOne: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    create: jest.Mock;
  };
  let notificationRepo: { save: jest.Mock; create: jest.Mock };

  beforeEach(async () => {
    recipientRepo = {
      findAndCount: jest.fn(),
      count: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    };
    notificationRepo = { save: jest.fn(), create: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        TypeormNotificationRepository,
        { provide: getRepositoryToken(NotificationEntity), useValue: notificationRepo },
        { provide: getRepositoryToken(NotificationRecipientEntity), useValue: recipientRepo },
      ],
    }).compile();

    repository = moduleRef.get(TypeormNotificationRepository);
  });

  it('finds paginated notifications ordered by creation date', async () => {
    recipientRepo.findAndCount.mockResolvedValue([
      [
        {
          notificationId: '1',
          userId: 'admin-1',
          readAt: null,
          notification: { notificationId: '1', type: NotificationType.ACCESS },
        },
      ],
      21,
    ]);

    const result = await repository.findAllForUser('admin-1', { page: 2, limit: 20 });

    expect(recipientRepo.findAndCount).toHaveBeenCalledWith({
      where: { userId: 'admin-1' },
      relations: ['notification'],
      order: { notification: { createdAt: 'DESC' } },
      skip: 20,
      take: 20,
    });
    expect(result).toEqual({
      data: expect.any(Array),
      total: 21,
      page: 2,
      limit: 20,
      totalPages: 2,
    });
  });

  it('filters unread notifications with readAt IS NULL', async () => {
    recipientRepo.findAndCount.mockResolvedValue([[], 0]);

    await repository.findAllForUser('admin-1', { page: 1, limit: 20, read: false });

    expect(recipientRepo.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: 'admin-1', readAt: IsNull() }),
      }),
    );
  });

  it('filters read notifications with readAt IS NOT NULL', async () => {
    recipientRepo.findAndCount.mockResolvedValue([[], 0]);

    await repository.findAllForUser('admin-1', { page: 1, limit: 20, read: true });

    expect(recipientRepo.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: 'admin-1', readAt: expect.objectContaining({ _type: 'not' }) }),
      }),
    );
  });

  it('marks all unread notifications only for the authenticated user', async () => {
    recipientRepo.update.mockResolvedValue({ affected: 4 });

    await expect(repository.markAllAsReadForUser('admin-1')).resolves.toBe(4);

    expect(recipientRepo.update).toHaveBeenCalledWith({ userId: 'admin-1', readAt: IsNull() }, { readAt: expect.any(Date) });
  });

  it('does not affect other admins when marking all as read', async () => {
    recipientRepo.update.mockResolvedValue({ affected: 2 });

    await repository.markAllAsReadForUser('admin-1');

    expect(recipientRepo.update).not.toHaveBeenCalledWith(expect.objectContaining({ userId: 'admin-2' }), expect.anything());
  });

  it('is idempotent when no unread rows are updated', async () => {
    recipientRepo.update.mockResolvedValue({ affected: 0 });

    await expect(repository.markAllAsReadForUser('admin-1')).resolves.toBe(0);
  });
});
