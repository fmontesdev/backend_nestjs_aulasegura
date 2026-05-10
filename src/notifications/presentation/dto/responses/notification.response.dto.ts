import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../../../domain/entities/notification.entity';

export class NotificationResponseDto {
  @ApiProperty({ example: '1' })
  notificationId!: string;

  @ApiProperty({ enum: NotificationType, example: NotificationType.ACCESS })
  type!: NotificationType;

  @ApiProperty({ example: 'Acceso denegado' })
  title!: string;

  @ApiProperty({ example: 'Ada Lovelace no pudo acceder a Aula 1' })
  body!: string;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-05-10T14:29:35.000+02:00' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time', nullable: true, example: '2026-05-10T14:30:10.000+02:00' })
  readAt!: string | null;
}
