import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiParam, ApiBody, ApiUnauthorizedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiCreatedResponse, ApiConflictResponse
} from '@nestjs/swagger';
import { EventScheduleService } from '../../application/services/event-schedule.service';
import { EventScheduleResponse } from '../dto/responses/event-schedule.response.dto';
import { EventScheduleMapper } from '../mappers/event-schedule.mapper';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

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
}
