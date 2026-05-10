import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { NotificationEventEmitter } from './application/services/notification-event-emitter.service';
import { NotificationService } from './application/services/notification.service';
import { NotificationRecipientEntity } from './domain/entities/notification-recipient.entity';
import { NotificationEntity } from './domain/entities/notification.entity';
import { NotificationRepository } from './domain/repositories/notification.repository';
import { TypeormNotificationRepository } from './infrastructure/persistence/typeorm/typeorm-notification.repository';
import { NotificationController } from './presentation/controllers/notification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, NotificationRecipientEntity]), UsersModule],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationEventEmitter,
    {
      provide: NotificationRepository,
      useClass: TypeormNotificationRepository,
    },
  ],
  exports: [NotificationService],
})
export class NotificationsModule {}
