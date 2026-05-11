import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam, ApiBody, ApiBearerAuth, ApiUnauthorizedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiCreatedResponse, ApiConflictResponse
} from '@nestjs/swagger';
import { ReaderService } from '../../application/services/reader.service';
import { CreateReaderRequest } from '../dto/requests/create-reader.request.dto';
import { UpdateReaderRequest } from '../dto/requests/update-reader.request.dto';
import { GetReadersQueryRequest } from '../dto/requests/get-readers-query.request.dto';
import { ReaderResponse } from '../dto/responses/reader.response.dto';
import { PaginatedReadersResponse } from '../dto/responses/paginated-readers.response.dto';
import { ReaderMapper } from '../mappers/reader.mapper';
import { parseFiltersString } from '../utils/filters-parser.util';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

@ApiTags('readers')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido. Permisos insuficientes' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('readers')
export class ReaderController {
  constructor(private readonly readerService: ReaderService) {}

  @ApiOperation({ summary: 'Lista todos los lectores con paginación y filtros' })
  @ApiOkResponse({ type: PaginatedReadersResponse })
  @Roles(RoleName.ADMIN)
  @Get()
  async findAll(@Query() query: GetReadersQueryRequest): Promise<PaginatedReadersResponse> {
    const parsedFilters = query.filters ? parseFiltersString(query.filters) : {};
    const filters = {
      page: query.page || 1,
      limit: query.limit || 10,
      ...parsedFilters,
    };

    const result = await this.readerService.findAllWithFilters(filters);
    return ReaderMapper.toPaginatedResponse(result);
  }

  @ApiOperation({ summary: 'Muestra un lector por ID' })
  @ApiParam({ name: 'id', description: 'Reader ID', type: Number })
  @ApiOkResponse({ type: ReaderResponse })
  @ApiNotFoundResponse({ description: 'Lector no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ReaderResponse> {
    const reader = await this.readerService.findOne(id);
    return ReaderMapper.toResponse(reader);
  }

  @ApiOperation({ summary: 'Crea un nuevo lector' })
  @ApiBody({ type: CreateReaderRequest })
  @ApiCreatedResponse({ description: 'Lector creado con éxito', type: ReaderResponse })
  @ApiConflictResponse({ description: 'Ya existe un lector con este código' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Roles(RoleName.ADMIN)
  @Post()
  async create(@Body() requestDto: CreateReaderRequest): Promise<ReaderResponse> {
    const reader = await this.readerService.create(requestDto);
    return ReaderMapper.toResponse(reader);
  }

  @ApiOperation({ summary: 'Actualizar un lector existente' })
  @ApiParam({ name: 'id', description: 'Reader ID', type: Number })
  @ApiBody({ type: UpdateReaderRequest })
  @ApiOkResponse({ description: 'Lector actualizado con éxito', type: ReaderResponse })
  @ApiNotFoundResponse({ description: 'Lector no encontrado' })
  @ApiConflictResponse({ description: 'Ya existe un lector con el nuevo código' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o el parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() requestDto: UpdateReaderRequest): Promise<ReaderResponse> {
    const reader = await this.readerService.update(id, requestDto);
    return ReaderMapper.toResponse(reader);
  }

  @ApiOperation({ summary: 'Desactiva un lector (soft delete)' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del lector a desactivar', example: 1 })
  @ApiOkResponse({
    description: 'Lector desactivado con éxito',
    schema: { type: 'object', properties: { message: { type: 'string', example: 'Lector desactivado con éxito' } } },
  })
  @ApiNotFoundResponse({ description: 'Lector no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Delete(':id')
  async softRemove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.readerService.softRemove(id);
    return { message: 'Reader deactivated successfully' };
  }
}
