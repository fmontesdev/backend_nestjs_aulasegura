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

  @ApiProperty({ type: Date })
  createdAt!: Date;

  @ApiProperty({ type: Date, nullable: true })
  readAt!: Date | null;
}
