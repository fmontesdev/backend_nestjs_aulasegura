import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam, ApiBody, ApiBearerAuth, ApiUnauthorizedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiCreatedResponse, ApiConflictResponse, ApiQuery
} from '@nestjs/swagger';
import { RoomService } from '../../application/services/room.service';
import { CreateRoomRequest } from '../dto/requests/create-room.request.dto';
import { UpdateRoomRequest } from '../dto/requests/update-room.request.dto';
import { FindAvailableRoomsRequest } from '../dto/requests/find-available-rooms.request.dto';
import { GetRoomsQueryRequest } from '../dto/requests/get-rooms-query.request.dto';
import { RoomResponse } from '../dto/responses/room.response.dto';
import { PaginatedRoomsResponse } from '../dto/responses/paginated-rooms.response.dto';
import { RoomMapper } from '../mappers/room.mapper';
import { parseFiltersString } from '../utils/filters-parser.util';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

@ApiTags('rooms')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido. Permisos insuficientes' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: 'Lista todas las aulas con paginación y filtros' })
  @ApiOkResponse({ type: PaginatedRoomsResponse })
  @Roles(RoleName.ADMIN)
  @Get()
  async findAll(@Query() query: GetRoomsQueryRequest): Promise<PaginatedRoomsResponse> {
    const parsedFilters = query.filters ? parseFiltersString(query.filters) : {};
    const filters = {
      page: query.page || 1,
      limit: query.limit || 10,
      ...parsedFilters,
    };

    const result = await this.roomService.findAllWithFilters(filters);
    return RoomMapper.toPaginatedResponse(result);
  }

  @ApiOperation({ 
    summary: 'Busca aulas disponibles en una fecha y horario específico',
    description: 'Devuelve todas las aulas que NO tienen permisos activos (semanales o eventos) en el horario especificado'
  })
  @ApiQuery({ name: 'date', type: String, description: 'Fecha en formato YYYY-MM-DD', example: '2025-11-22' })
  @ApiQuery({ name: 'startAt', type: String, description: 'Hora de inicio en formato HH:MM', example: '09:00' })
  @ApiQuery({ name: 'endAt', type: String, description: 'Hora de fin en formato HH:MM', example: '11:00' })
  @ApiOkResponse({ 
    description: 'Lista de aulas disponibles',
    type: [RoomResponse]
  })
  @ApiBadRequestResponse({ description: 'Parámetros inválidos (formato de fecha u hora incorrecto)' })
  @Roles(RoleName.TEACHER)
  @Get('available')
  async findAvailableRooms(@Query() query: FindAvailableRoomsRequest): Promise<RoomResponse[]> {
    const availableRooms = await this.roomService.findAvailableRooms({
      date: query.date,
      startAt: query.startAt,
      endAt: query.endAt
    });
    return RoomMapper.toResponseList(availableRooms);
  }

  @ApiOperation({ summary: 'Muestra una aula por ID' })
  @ApiParam({ name: 'id', description: 'Room ID', type: Number })
  @ApiOkResponse({ type: RoomResponse })
  @ApiNotFoundResponse({ description: 'Aula no encontrada' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RoomResponse> {
    const room = await this.roomService.findOne(id);
    return RoomMapper.toResponse(room);
  }

  @ApiOperation({ summary: 'Create a new room' })
  @ApiBody({ type: CreateRoomRequest })
  @ApiCreatedResponse({ description: 'Aula creada con éxito', type: RoomResponse })
  @ApiConflictResponse({ description: 'Ya existe una aula con este código' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o rawUid faltante para RFID' })
  @Roles(RoleName.ADMIN)
  @Post()
  async create(@Body() requestDto: CreateRoomRequest): Promise<RoomResponse> {
    const room = await this.roomService.create(requestDto);
    return RoomMapper.toResponse(room);
  }

  @ApiOperation({ summary: 'Actualizar un aula existente' })
  @ApiParam({ name: 'id', description: 'Room ID', type: Number })
  @ApiBody({ type: UpdateRoomRequest })
  @ApiOkResponse({ description: 'Aula actualizada con éxito', type: RoomResponse })
  @ApiNotFoundResponse({ description: 'Aula no encontrada' })
  @ApiConflictResponse({ description: 'Ya existe un aula con el nuevo código' })
  @ApiBadRequestResponse({ description: 'Datos inválidos, rawUid faltante para RFID o el parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Patch('update/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() requestDto: UpdateRoomRequest): Promise<RoomResponse> {
    const room = await this.roomService.update(id, requestDto);
    return RoomMapper.toResponse(room);
  }

  @ApiOperation({ summary: 'Elimina una aula' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del aula a eliminar', example: 1 })
  @ApiOkResponse({
    description: 'Aula eliminada con éxito',
    schema: { type: 'object', properties: { message: { type: 'string', example: 'Aula eliminada con éxito' } } },
  })
  @ApiNotFoundResponse({ description: 'Aula no encontrada' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.roomService.delete(id);
    return { message: 'Aula eliminada con éxito' };
  }
}
