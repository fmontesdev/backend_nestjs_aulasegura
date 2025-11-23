import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiParam, ApiBody, ApiUnauthorizedResponse, 
  ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiCreatedResponse, ApiConflictResponse
} from '@nestjs/swagger';
import { PermissionService } from '../../application/services/permission.service';
import { CreateWeeklySchedulePermissionRequest } from '../dto/requests/create-weekly-schedule-permission.request.dto';
import { UpdateWeeklySchedulePermissionRequest } from '../dto/requests/update-weekly-schedule-permission.request.dto';
import { CreateEventSchedulePermissionRequest } from '../dto/requests/create-event-schedule-permission.request.dto';
import { PermissionResponse } from '../dto/responses/permission.response.dto';
import { PermissionMapper } from '../mappers/permission.mapper';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';

@ApiTags('permissions')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido. Requiere rol ADMIN' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({ summary: 'Lista todos los permisos activos' })
  @ApiOkResponse({ type: [PermissionResponse] })
  @Roles(RoleName.ADMIN)
  @Get()
  async findAll(): Promise<PermissionResponse[]> {
    const permissions = await this.permissionService.findAll();
    return PermissionMapper.toResponseList(permissions);
  }

  @ApiOperation({ 
    summary: 'Obtiene las reservas activas del usuario autenticado',
    description: 'Devuelve todas las reservas (event_schedule.type=RESERVATION) vigentes desde la fecha/hora actual'
  })
  @ApiOkResponse({ 
    description: 'Lista de reservas activas del usuario',
    type: [PermissionResponse] 
  })
  @Roles(RoleName.TEACHER)
  @Get('my-reservations')
  async findMyReservations(@CurrentUser() currentUser: any): Promise<PermissionResponse[]> {
    const reservations = await this.permissionService.findMyActiveReservations(currentUser.userId);
    return PermissionMapper.toResponseList(reservations);
  }

  @ApiOperation({ 
    summary: 'Obtiene los horarios semanales activos del usuario autenticado',
    description: 'Devuelve todos los horarios semanales del año académico activo para el usuario autenticado'
  })
  @ApiOkResponse({ 
    description: 'Lista de horarios semanales del usuario',
    type: [PermissionResponse] 
  })
  @Get('my-weekly-schedules')
  async findMyWeeklySchedules(@CurrentUser() currentUser: any): Promise<PermissionResponse[]> {
    const weeklySchedules = await this.permissionService.findMyWeeklySchedules(currentUser.userId);
    return PermissionMapper.toResponseList(weeklySchedules);
  }

  @ApiOperation({ summary: 'Obtiene un permiso por su clave compuesta' })
  @ApiParam({ name: 'userId', type: 'string', description: 'ID del usuario' })
  @ApiParam({ name: 'roomId', type: 'integer', description: 'ID del aula' })
  @ApiParam({ name: 'scheduleId', type: 'integer', description: 'ID del horario' })
  @ApiOkResponse({ type: PermissionResponse })
  @ApiNotFoundResponse({ description: 'Permiso no encontrado' })
  @Roles(RoleName.ADMIN)
  @Get(':userId/:roomId/:scheduleId')
  async findOne(
    @Param('userId') userId: string,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<PermissionResponse> {
    const permission = await this.permissionService.findOne(userId, roomId, scheduleId);
    return PermissionMapper.toResponse(permission);
  }

  @ApiOperation({ summary: 'Crea los permisos para un horario semanal' })
  @ApiBody({ type: CreateWeeklySchedulePermissionRequest })
  @ApiCreatedResponse({ description: 'Permiso creado con éxito', type: PermissionResponse })
  @ApiConflictResponse({ description: 'Ya existe un permiso con estos identificadores o solapamiento de horarios' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Roles(RoleName.ADMIN)
  @Post('weekly-schedule')
  async createWeeklySchedule(@Body() requestDto: CreateWeeklySchedulePermissionRequest, @CurrentUser() currentUser: any): Promise<PermissionResponse> {
    const permission = await this.permissionService.createWeeklySchedule({
      userId: requestDto.userId,
      roomId: requestDto.roomId,
      scheduleId: requestDto.scheduleId,
      createdById: currentUser.userId,
    });
    return PermissionMapper.toResponse(permission);
  }

  @ApiOperation({ summary: 'Actualiza los permisos de un horario semanal' })
  @ApiParam({ name: 'userId', type: 'string', description: 'ID del usuario actual' })
  @ApiParam({ name: 'roomId', type: 'integer', description: 'ID del aula actual' })
  @ApiParam({ name: 'scheduleId', type: 'integer', description: 'ID del horario' })
  @ApiBody({ type: UpdateWeeklySchedulePermissionRequest })
  @ApiOkResponse({ description: 'Permiso y horario actualizados con éxito', type: PermissionResponse })
  @ApiNotFoundResponse({ description: 'Permiso no encontrado' })
  @ApiConflictResponse({ description: 'Conflicto: permiso duplicado o solapamiento de horarios' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Roles(RoleName.ADMIN)
  @Patch('weekly-schedule/:userId/:roomId/:scheduleId')
  async updateWeeklySchedule(
    @Param('userId') userId: string,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @ CurrentUser() currentUser: any,
    @Body() requestDto: UpdateWeeklySchedulePermissionRequest,
  ): Promise<PermissionResponse> {
    const permission = await this.permissionService.updateWeeklySchedule(userId, roomId, scheduleId, currentUser, requestDto);
    return PermissionMapper.toResponse(permission);
  }

  @ApiOperation({ summary: 'Crea un horario de evento con el permiso asociado' })
  @ApiBody({ type: CreateEventSchedulePermissionRequest })
  @ApiCreatedResponse({ description: 'Permiso creado con éxito', type: PermissionResponse })
  @ApiConflictResponse({ description: 'Ya existe un permiso con estos identificadores o solapamiento de horarios' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Roles(RoleName.TEACHER, RoleName.JANITOR)
  @Post('event-schedule')
  async createEventSchedule(@Body() requestDto: CreateEventSchedulePermissionRequest, @CurrentUser() currentUser: any): Promise<PermissionResponse> {
    const permission = await this.permissionService.createEventSchedule(requestDto, currentUser);
    return PermissionMapper.toResponse(permission);
  }

  @ApiOperation({ summary: 'Desactiva un permiso (soft delete)', description: 'Establece isActive en false' })
  @ApiParam({ name: 'userId', type: 'string', description: 'ID del usuario' })
  @ApiParam({ name: 'roomId', type: 'integer', description: 'ID del aula' })
  @ApiParam({ name: 'scheduleId', type: 'integer', description: 'ID del horario' })
  @ApiOkResponse({
    description: 'Permiso desactivado con éxito',
    schema: { type: 'object', properties: { message: { type: 'string', example: 'Permiso desactivado con éxito' } } },
  })
  @ApiNotFoundResponse({ description: 'Permiso no encontrado' })
  @Roles(RoleName.ADMIN)
  @Delete(':userId/:roomId/:scheduleId')
  async softRemove(
    @Param('userId') userId: string,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<{ message: string }> {
    await this.permissionService.softRemove(userId, roomId, scheduleId);
    return { message: 'Permission deactivated successfully' };
  }

  @ApiOperation({ summary: 'Elimina un permiso (hard delete)', description: 'Elimina un permiso de forma permanente' })
  @ApiParam({ name: 'userId', type: 'string', description: 'ID del usuario' })
  @ApiParam({ name: 'roomId', type: 'integer', description: 'ID del aula' })
  @ApiParam({ name: 'scheduleId', type: 'integer', description: 'ID del horario' })
  @ApiOkResponse({
    description: 'Permiso eliminado con éxito',
    schema: { type: 'object', properties: { message: { type: 'string', example: 'Permiso eliminado con éxito' } } },
  })
  @ApiNotFoundResponse({ description: 'Permiso no encontrado' })
  @Roles(RoleName.TEACHER, RoleName.JANITOR)
  @Delete('delete/:userId/:roomId/:scheduleId')
  async hardRemove(
    @Param('userId') userId: string,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<{ message: string }> {
    await this.permissionService.hardRemove(userId, roomId, scheduleId);
    return { message: 'Permission deleted successfully' };
  }
}
