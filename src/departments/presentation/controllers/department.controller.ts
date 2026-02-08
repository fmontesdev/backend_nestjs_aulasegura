import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth, ApiParam, ApiBody, ApiUnauthorizedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { DepartmentService } from '../../application/services/department.service';
import { CreateDepartmentRequest } from '../dto/requests/create-department.request.dto';
import { UpdateDepartmentRequest } from '../dto/requests/update-department.request.dto';
import { GetDepartmentsQueryRequest } from '../dto/requests/get-departments-query.request.dto';
import { DepartmentResponse } from '../dto/responses/department.response.dto';
import { PaginatedDepartmentsResponse } from '../dto/responses/paginated-departments.response.dto';
import { DepartmentMapper } from '../mappers/department.mapper';
import { parseFiltersString } from '../utils/filters-parser.util';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

@ApiTags('departments')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido. Permisos insuficientes, requiere rol ADMIN' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @ApiOperation({ summary: 'Lista todos los departamentos activos' })
  @ApiOkResponse({ type: [DepartmentResponse] })
  @Roles(RoleName.ADMIN)
  @Get()
  async findAll(): Promise<DepartmentResponse[]> {
    const departments = await this.departmentService.findAll();
    return DepartmentMapper.toResponseList(departments);
  }

  @ApiOperation({ summary: 'Lista todos los departamentos activos con relaciones (asignaturas, cursos, profesores, etc.) con paginación y filtros' })
  @ApiOkResponse({ type: PaginatedDepartmentsResponse })
  @Roles(RoleName.ADMIN)
  @Get('filters')
  async findAllWithFilters(@Query() query: GetDepartmentsQueryRequest): Promise<PaginatedDepartmentsResponse> {
    const parsedFilters = query.filters ? parseFiltersString(query.filters) : {};
    const filters = {
      page: query.page || 1,
      limit: query.limit || 10,
      ...parsedFilters,
    };

    const result = await this.departmentService.findAllWithFilters(filters);
    return DepartmentMapper.toPaginatedResponse(result, filters.page, filters.limit);
  }

  @ApiOperation({ summary: 'Muestra un departamento por ID' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del departamento', example: 1 })
  @ApiOkResponse({ type: DepartmentResponse })
  @ApiNotFoundResponse({ description: 'Departamento no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<DepartmentResponse> {
    const department = await this.departmentService.findOne(id);
    return DepartmentMapper.toResponse(department);
  }

  @ApiOperation({ summary: 'Crea un nuevo departamento' })
  @ApiBody({ type: CreateDepartmentRequest })
  @ApiCreatedResponse({ description: 'Departamento creado con éxito', type: DepartmentResponse })
  @ApiConflictResponse({ description: 'El departamento no pudo ser creado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Roles(RoleName.ADMIN)
  @Post()
  async create(@Body() requestDto: CreateDepartmentRequest): Promise<DepartmentResponse> {
    const department = await this.departmentService.create(requestDto);
    return DepartmentMapper.toResponse(department);
  }

  @ApiOperation({ summary: 'Actualiza un departamento existente' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del departamento a actualizar', example: 1 })
  @ApiBody({ type: UpdateDepartmentRequest })
  @ApiOkResponse({ description: 'Departamento actualizado con éxito', type: DepartmentResponse })
  @ApiNotFoundResponse({ description: 'Departamento no encontrado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Roles(RoleName.ADMIN)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() requestDto: UpdateDepartmentRequest): Promise<DepartmentResponse> {
    const department = await this.departmentService.update(id, requestDto);
    return DepartmentMapper.toResponse(department);
  }

  @ApiOperation({ summary: 'Desactiva un departamento (soft delete)', description: 'Establece isActive en false para el departamento especificado' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del departamento a desactivar', example: 1 })
  @ApiOkResponse({
    description: 'Departamento desactivado con éxito',
    schema: { type: 'object', properties: { message: { type: 'string', example: 'Departamento desactivado con éxito' } } },
  })
  @ApiNotFoundResponse({ description: 'Departamento no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Delete(':id')
  async softRemove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.departmentService.softRemove(id);
    return { message: 'Department deactivated successfully' };
  }
}
