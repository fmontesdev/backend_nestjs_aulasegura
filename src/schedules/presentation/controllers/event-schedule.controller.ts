import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiParam, ApiBody, ApiUnauthorizedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiCreatedResponse, ApiConflictResponse
} from '@nestjs/swagger';
import { EventScheduleService } from '../../application/services/event-schedule.service';
import { UpdateWeeklyScheduleRequest } from '../dto/requests/update-event-schedule.request.dto';
import { EventScheduleResponse } from '../dto/responses/event-schedule.response.dto';
import { EventScheduleMapper } from '../mappers/event-schedule.mapper';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';
import { CurrentUser } from 'src/auth/infrastructure/decorators/current-user.decorator';

@ApiTags('event-schedules')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido. Requiere rol ADMIN' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('event-schedules')
export class EventScheduleController {
  constructor(private readonly eventScheduleService: EventScheduleService) {}

  @ApiOperation({ summary: 'Lista todos los horarios de eventos activos' })
  @ApiOkResponse({ type: [EventScheduleResponse] })
  @Roles(RoleName.ADMIN)
  @Get()
  async findAll(): Promise<EventScheduleResponse[]> {
    const eventSchedules = await this.eventScheduleService.findAll();
    return EventScheduleMapper.toResponseList(eventSchedules);
  }

  @ApiOperation({ summary: 'Muestra un horario de evento por ID si está activo' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del horario', example: 1 })
  @ApiOkResponse({ type: EventScheduleResponse })
  @ApiNotFoundResponse({ description: 'Horario no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<EventScheduleResponse> {
    const eventSchedule = await this.eventScheduleService.findOne(id);
    return EventScheduleMapper.toResponse(eventSchedule);
  }

  @ApiOperation({
    summary: 'Actualiza un evento de horario',
    description: 'Solo actualiza los atributos: description (descripción), status (estado del evento) y reservationStatusReason (motivo de estado de reserva)'
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del horario a actualizar', example: 1 })
  @ApiBody({ type: UpdateWeeklyScheduleRequest })
  @ApiOkResponse({ description: 'Evento de horario actualizado con éxito', type: EventScheduleResponse })
  @ApiNotFoundResponse({ description: 'Horario no encontrado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o el parámetro id debe ser un entero' })
  @Roles(RoleName.TEACHER, RoleName.JANITOR, RoleName.ADMIN)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() requestDto: UpdateWeeklyScheduleRequest, @CurrentUser() currentUser: any): Promise<EventScheduleResponse> {
    const eventSchedule = await this.eventScheduleService.update(id, requestDto, currentUser);
    return EventScheduleMapper.toResponse(eventSchedule);
  }
}
