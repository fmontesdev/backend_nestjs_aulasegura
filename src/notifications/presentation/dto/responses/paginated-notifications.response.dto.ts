import { ApiProperty } from '@nestjs/swagger';
import { NotificationResponseDto } from './notification.response.dto';

export class NotificationPaginationMeta {
  @ApiProperty({ description: 'Total de notificaciones encontradas' })
  total!: number;

  @ApiProperty({ description: 'Página actual' })
  page!: number;

  @ApiProperty({ description: 'Límite de notificaciones por página' })
  limit!: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages!: number;

  @ApiProperty({ description: 'Hay página anterior' })
  hasPrevious!: boolean;

  @ApiProperty({ description: 'Hay página siguiente' })
  hasNext!: boolean;
}

export class PaginatedNotificationsResponse {
  @ApiProperty({ type: [NotificationResponseDto], description: 'Lista de notificaciones' })
  data!: NotificationResponseDto[];

  @ApiProperty({ type: NotificationPaginationMeta, description: 'Metadata de paginación' })
  meta!: NotificationPaginationMeta;
}
