import { Body, Controller, Get, MessageEvent, Param, Patch, Post, Query, Sse, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { interval, map, merge, Observable } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';
import { NotificationEventEmitter } from '../../application/services/notification-event-emitter.service';
import { NotificationService } from '../../application/services/notification.service';
import { CreateNotificationRequest } from '../dto/requests/create-notification.request.dto';
import { GetNotificationsQueryRequest } from '../dto/requests/get-notifications-query.request.dto';
import { CreateNotificationResponseDto } from '../dto/responses/create-notification.response.dto';
import { PaginatedNotificationsResponse } from '../dto/responses/paginated-notifications.response.dto';
import { NotificationResponseDto } from '../dto/responses/notification.response.dto';
import { NotificationMapper } from '../mappers/notification.mapper';

@ApiTags('notifications')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido. Requiere rol ADMIN' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN)
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationEventEmitter: NotificationEventEmitter,
  ) {}

  @ApiOperation({ summary: 'Envía una notificación manual a usuarios activos' })
  @ApiOkResponse({ type: CreateNotificationResponseDto })
  @Post()
  async create(@Body() body: CreateNotificationRequest): Promise<CreateNotificationResponseDto> {
    return this.notificationService.createManualNotification(body);
  }

  @ApiOperation({ summary: 'Lista notificaciones paginadas del administrador autenticado' })
  @ApiOkResponse({ type: PaginatedNotificationsResponse })
  @Get()
  async findAll(
    @Query() query: GetNotificationsQueryRequest,
    @CurrentUser() currentUser: any,
  ): Promise<PaginatedNotificationsResponse> {
    const result = await this.notificationService.findAllForUser(currentUser.userId, {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      read: query.read,
    });

    return NotificationMapper.toPaginatedResponse(result);
  }

  @ApiOperation({ summary: 'Cuenta notificaciones no leídas del administrador autenticado' })
  @ApiOkResponse({ schema: { example: { count: 3 } } })
  @Get('unread-count')
  async unreadCount(@CurrentUser() currentUser: any): Promise<{ count: number }> {
    const count = await this.notificationService.countUnreadForUser(currentUser.userId);
    return { count };
  }

  @ApiOperation({ summary: 'Stream en tiempo real de nuevas notificaciones' })
  @Sse('events')
  events(): Observable<MessageEvent> {
    const notificationEvents$ = this.notificationEventEmitter.asObservable().pipe(
      map((notification) => ({
        type: 'notification',
        data: notification,
      })),
    );

    const heartbeat$ = interval(30000).pipe(
      map(() => ({
        type: 'ping',
        data: { timestamp: new Date().toISOString() },
      })),
    );

    return merge(notificationEvents$, heartbeat$);
  }

  @ApiOperation({ summary: 'Marca todas las notificaciones pendientes como leídas para el administrador autenticado' })
  @ApiOkResponse({ schema: { example: { updated: 5 } } })
  @Patch('read-all')
  async markAllAsRead(@CurrentUser() currentUser: any): Promise<{ updated: number }> {
    return this.notificationService.markAllAsReadForUser(currentUser.userId);
  }

  @ApiOperation({ summary: 'Marca una notificación como leída para el administrador autenticado' })
  @ApiOkResponse({ type: NotificationResponseDto })
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() currentUser: any): Promise<NotificationResponseDto> {
    return this.notificationService.markAsReadForUser(id, currentUser.userId);
  }
}
