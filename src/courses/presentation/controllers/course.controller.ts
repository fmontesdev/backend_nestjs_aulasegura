import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth, ApiParam, ApiBody, ApiUnauthorizedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse, ApiBadRequestResponse,} from '@nestjs/swagger';
import { CourseService } from '../../application/services/course.service';
import { CreateCourseRequest } from '../dto/requests/create-course.request.dto';
import { UpdateCourseRequest } from '../dto/requests/update-course.request.dto';
import { GetCoursesQueryRequest } from '../dto/requests/get-courses-query.request.dto';
import { CourseResponse } from '../dto/responses/course.response.dto';
import { PaginatedCoursesResponse } from '../dto/responses/paginated-courses.response.dto';
import { CourseMapper } from '../mappers/course.mapper';
import { parseFiltersString } from '../utils/filters-parser.util';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

@ApiTags('courses')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido. Permisos insuficientes, requiere rol ADMIN' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: 'Lista todos los cursos con paginación y filtros' })
  @ApiOkResponse({ type: PaginatedCoursesResponse })
  @Roles(RoleName.ADMIN)
  @Get()
  async findAll(@Query() query: GetCoursesQueryRequest): Promise<PaginatedCoursesResponse> {
    const parsedFilters = query.filters ? parseFiltersString(query.filters) : {};
    const filters = {
      page: query.page || 1,
      limit: query.limit || 10,
      ...parsedFilters,
    };

    const result = await this.courseService.findAllWithFilters(filters);
    return CourseMapper.toPaginatedResponse(result, filters.page, filters.limit);
  }

  @ApiOperation({ summary: 'Muestra un curso por ID' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del curso', example: 1 })
  @ApiOkResponse({ type: CourseResponse })
  @ApiNotFoundResponse({ description: 'Curso no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CourseResponse> {
    const course = await this.courseService.findOne(id);
    return CourseMapper.toResponse(course);
  }

  @ApiOperation({ summary: 'Crea un nuevo curso' })
  @ApiBody({ type: CreateCourseRequest })
  @ApiCreatedResponse({ description: 'Curso creado con éxito', type: CourseResponse })
  @ApiConflictResponse({ description: 'Ya existe un curso con este código' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o stage fuera de rango (1-4)' })
  @Roles(RoleName.ADMIN)
  @Post()
  async create(@Body() requestDto: CreateCourseRequest): Promise<CourseResponse> {
    const course = await this.courseService.create(requestDto);
    return CourseMapper.toResponse(course);
  }

  @ApiOperation({ summary: 'Actualiza un curso existente' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del curso a actualizar', example: 1 })
  @ApiBody({ type: UpdateCourseRequest })
  @ApiOkResponse({ description: 'Curso actualizado con éxito', type: CourseResponse })
  @ApiNotFoundResponse({ description: 'Curso no encontrado' })
  @ApiConflictResponse({ description: 'Ya existe un curso con este código' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o stage fuera de rango (1-4)' })
  @Roles(RoleName.ADMIN)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() requestDto: UpdateCourseRequest): Promise<CourseResponse> {
    const course = await this.courseService.update(id, requestDto);
    return CourseMapper.toResponse(course);
  }

  @ApiOperation({ summary: 'Desactiva un curso (soft delete)', description: 'Establece isActive en false para el curso especificado' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del curso a desactivar', example: 1 })
  @ApiOkResponse({
    description: 'Curso desactivado con éxito',
    schema: { type: 'object', properties: { message: { type: 'string', example: 'Curso desactivado con éxito' } } },
  })
  @ApiNotFoundResponse({ description: 'Curso no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Delete(':id')
  async softRemove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.courseService.softRemove(id);
    return { message: 'Course deactivated successfully' };
  }
}
