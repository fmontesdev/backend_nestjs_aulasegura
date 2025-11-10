import { Controller, Get, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiParam,
  ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ScheduleService } from '../../application/services/schedule.service';
import { ScheduleResponse } from '../dto/responses/schedule.response.dto';
import { ScheduleMapper } from '../mappers/schedule.mapper';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

@ApiTags('schedules')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido. Requiere rol ADMIN' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({
    summary: 'Lista todos los horarios activos (weekly y event)',
    description: 'Lista todos los horarios del año académico activo. Para weekly valida que estén en periodo válido.',
  })
  @ApiOkResponse({ type: [ScheduleResponse] })
  @Roles(RoleName.ADMIN)
  @Get()
  async findAll(): Promise<ScheduleResponse[]> {
    const schedules = await this.scheduleService.findAll();
    return ScheduleMapper.toResponseList(schedules);
  }

  @ApiOperation({
    summary: 'Obtiene un horario por ID',
    description: 'Muestra un horario (weekly o event) por ID del año académico activo.',
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del horario', example: 1 })
  @ApiOkResponse({ type: ScheduleResponse })
  @ApiNotFoundResponse({ description: 'Horario no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ScheduleResponse> {
    const schedule = await this.scheduleService.findOne(id);
    return ScheduleMapper.toResponse(schedule);
  }

  @ApiOperation({
    summary: 'Desactiva un horario (soft delete)',
    description: 'Establece isActive en false para el horario especificado (weekly o event).',
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del horario a desactivar', example: 1 })
  @ApiOkResponse({
    description: 'Horario desactivado con éxito',
    schema: { type: 'object', properties: { message: { type: 'string', example: 'Schedule deactivated successfully' } } },
  })
  @ApiNotFoundResponse({ description: 'Horario no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Delete(':id')
  async softRemove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.scheduleService.softRemove(id);
    return { message: 'Schedule deactivated successfully' };
  }

  @ApiOperation({
    summary: 'Elimina un horario permanentemente (hard delete)',
    description: 'Elimina un horario (weekly o event) de forma permanente junto con sus permisos asociados.',
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del horario a eliminar', example: 1 })
  @ApiOkResponse({
    description: 'Horario eliminado con éxito',
    schema: { type: 'object', properties: { message: { type: 'string', example: 'Schedule deleted successfully' } } },
  })
  @ApiNotFoundResponse({ description: 'Horario no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Delete('delete/:id')
  async hardRemove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.scheduleService.hardRemove(id);
    return { message: 'Schedule deleted successfully' };
  }
}
