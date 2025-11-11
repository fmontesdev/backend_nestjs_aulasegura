import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiParam, ApiBody, ApiUnauthorizedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiCreatedResponse, ApiConflictResponse
} from '@nestjs/swagger';
import { WeeklyScheduleService } from '../../application/services/weekly-schedule.service';
import { CreateWeeklyScheduleRequest } from '../dto/requests/create-weekly-schedule.request.dto';
import { UpdateWeeklyScheduleRequest } from '../dto/requests/update-weekly-schedule.request.dto';
import { WeeklyScheduleResponse } from '../dto/responses/weekly-schedule.response.dto';
import { WeeklyScheduleMapper } from '../mappers/weekly-schedule.mapper';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

@ApiTags('weekly-schedules')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido. Requiere rol ADMIN' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('weekly-schedules')
export class WeeklyScheduleController {
  constructor(private readonly weeklyScheduleService: WeeklyScheduleService) {}

  @ApiOperation({ summary: 'Lista todos los horarios semanales activos y válidos' })
  @ApiOkResponse({ type: [WeeklyScheduleResponse] })
  @Roles(RoleName.ADMIN)
  @Get()
  async findAll(): Promise<WeeklyScheduleResponse[]> {
    const weeklySchedules = await this.weeklyScheduleService.findAll();
    return WeeklyScheduleMapper.toResponseList(weeklySchedules);
  }

  @ApiOperation({ summary: 'Muestra un horario semanal por ID si está activo y válido' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del horario', example: 1 })
  @ApiOkResponse({ type: WeeklyScheduleResponse })
  @ApiNotFoundResponse({ description: 'Horario no encontrado o no válido actualmente' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<WeeklyScheduleResponse> {
    const weeklySchedule = await this.weeklyScheduleService.findOne(id);
    return WeeklyScheduleMapper.toResponse(weeklySchedule);
  }

  @ApiOperation({ 
    summary: 'Crea un nuevo horario semanal',
    description: 'Crea un horario semanal asociado al año académico activo. Valida que no existan solapamientos de horarios en el mismo día de la semana.'
  })
  @ApiBody({ type: CreateWeeklyScheduleRequest })
  @ApiCreatedResponse({ description: 'Horario semanal creado con éxito', type: WeeklyScheduleResponse })
  @ApiConflictResponse({ description: 'Ya existe un horario que se solapa con el proporcionado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o no hay año académico activo' })
  @Roles(RoleName.ADMIN)
  @Post()
  async create(@Body() requestDto: CreateWeeklyScheduleRequest): Promise<WeeklyScheduleResponse> {
    const weeklySchedule = await this.weeklyScheduleService.create(requestDto);
    return WeeklyScheduleMapper.toResponse(weeklySchedule);
  }

  @ApiOperation({
    summary: 'Actualiza un horario semanal',
    description: 'Actualiza los siguientes atributos del horario semanal: dayOfWeek (dia de la semana), startTime (hora de incio), endTime (hora de fin)'
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del horario a actualizar', example: 1 })
  @ApiBody({ type: UpdateWeeklyScheduleRequest })
  @ApiOkResponse({ description: 'Horario actualizado con éxito', type: WeeklyScheduleResponse })
  @ApiNotFoundResponse({ description: 'Horario no encontrado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o el parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() requestDto: UpdateWeeklyScheduleRequest): Promise<WeeklyScheduleResponse> {
    const weeklySchedule = await this.weeklyScheduleService.update(id, requestDto);
    return WeeklyScheduleMapper.toResponse(weeklySchedule);
  }
}
