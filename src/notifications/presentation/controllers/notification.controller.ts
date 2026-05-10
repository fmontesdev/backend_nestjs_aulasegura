import { Controller, Get, MessageEvent, Param, Patch, Sse, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { interval, map, merge, Observable } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';
import { NotificationEventEmitter } from '../../application/services/notification-event-emitter.service';
import { NotificationService } from '../../application/services/notification.service';
import { NotificationResponseDto } from '../dto/responses/notification.response.dto';

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

  @ApiOperation({ summary: 'Lista las últimas notificaciones del administrador autenticado' })
  @ApiOkResponse({ type: [NotificationResponseDto] })
  @Get()
  async findLatest(@CurrentUser() currentUser: any): Promise<NotificationResponseDto[]> {
    return this.notificationService.findLatestForUser(currentUser.userId);
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

  @ApiOperation({ summary: 'Marca una notificación como leída para el administrador autenticado' })
  @ApiOkResponse({ type: NotificationResponseDto })
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() currentUser: any): Promise<NotificationResponseDto> {
    return this.notificationService.markAsReadForUser(id, currentUser.userId);
  }
}
