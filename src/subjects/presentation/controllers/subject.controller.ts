import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth, ApiParam, ApiBody, ApiUnauthorizedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse, ApiBadRequestResponse,} from '@nestjs/swagger';
import { SubjectService } from '../../application/services/subject.service';
import { CreateSubjectRequest } from '../dto/requests/create-subject.request.dto';
import { UpdateSubjectRequest } from '../dto/requests/update-subject.request.dto';
import { GetSubjectsQueryRequest } from '../dto/requests/get-subjects-query.request.dto';
import { SubjectResponse } from '../dto/responses/subject.response.dto';
import { PaginatedSubjectsResponse } from '../dto/responses/paginated-subjects.response.dto';
import { SubjectMapper } from '../mappers/subject.mapper';
import { parseFiltersString } from '../utils/filters-parser.util';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

@ApiTags('subjects')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido. Permisos insuficientes, requiere rol ADMIN' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiOperation({ summary: 'Lista todas las asignaturas con paginación y filtros' })
  @ApiOkResponse({ type: PaginatedSubjectsResponse })
  @Roles(RoleName.ADMIN)
  @Get()
  async findAll(@Query() query: GetSubjectsQueryRequest): Promise<PaginatedSubjectsResponse> {
    const parsedFilters = query.filters ? parseFiltersString(query.filters) : {};
    const filters = {
      page: query.page || 1,
      limit: query.limit || 10,
      ...parsedFilters,
    };

    const result = await this.subjectService.findAllWithFilters(filters);
    return SubjectMapper.toPaginatedResponse(result, filters.page, filters.limit);
  }

  @ApiOperation({ summary: 'Muestra una asignatura por ID' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID de la asignatura', example: 1 })
  @ApiOkResponse({ type: SubjectResponse })
  @ApiNotFoundResponse({ description: 'Asignatura no encontrada' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SubjectResponse> {
    const subject = await this.subjectService.findOne(id);
    return SubjectMapper.toResponse(subject);
  }

  @ApiOperation({ summary: 'Crea una nueva asignatura' })
  @ApiBody({ type: CreateSubjectRequest })
  @ApiCreatedResponse({ description: 'Asignatura creada con éxito', type: SubjectResponse })
  @ApiConflictResponse({ description: 'Ya existe una asignatura con este código' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Roles(RoleName.ADMIN)
  @Post()
  async create(@Body() requestDto: CreateSubjectRequest): Promise<SubjectResponse> {
    const subject = await this.subjectService.create(requestDto);
    return SubjectMapper.toResponse(subject);
  }

  @ApiOperation({ summary: 'Actualiza una asignatura existente' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID de la asignatura a actualizar', example: 1 })
  @ApiBody({ type: UpdateSubjectRequest })
  @ApiOkResponse({ description: 'Asignatura actualizada con éxito', type: SubjectResponse })
  @ApiNotFoundResponse({ description: 'Asignatura no encontrada' })
  @ApiConflictResponse({ description: 'Ya existe una asignatura con este código' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Roles(RoleName.ADMIN)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() requestDto: UpdateSubjectRequest): Promise<SubjectResponse> {
    const subject = await this.subjectService.update(id, requestDto);
    return SubjectMapper.toResponse(subject);
  }

  @ApiOperation({ summary: 'Desactiva una asignatura (soft delete)', description: 'Establece isActive en false para la asignatura especificada' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID de la asignatura a desactivar', example: 1 })
  @ApiOkResponse({
    description: 'Asignatura desactivada con éxito',
    schema: { type: 'object', properties: { message: { type: 'string', example: 'Asignatura desactivada con éxito' } } },
  })
  @ApiNotFoundResponse({ description: 'Asignatura no encontrada' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Delete(':id')
  async softRemove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.subjectService.softRemove(id);
    return { message: 'Subject deactivated successfully' };
  }
}
