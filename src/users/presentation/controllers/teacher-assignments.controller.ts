import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { RoleName } from '../../domain/enums/rolename.enum';
import { TeacherAssignmentsService } from '../../application/services/teacher-assignments.service';
import { CreateTeacherAssignmentRequest } from '../dto/requests/create-teacher-assignment.request.dto';
import { DeleteTeacherAssignmentRequest } from '../dto/requests/delete-teacher-assignment.request.dto';
import { GetTeacherAssignmentsQueryRequest } from '../dto/requests/get-teacher-assignments-query.request.dto';
import { PaginatedTeacherAssignmentsResponse } from '../dto/responses/paginated-teacher-assignments.response.dto';
import { TeacherAssignmentResponse } from '../dto/responses/teacher-assignment.response.dto';
import { parseTeacherAssignmentsFiltersString } from '../utils/teacher-assignments-filters-parser.util';

@ApiTags('teacher-assignments')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido. Permisos insuficientes, requiere rol ADMIN' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN)
@Controller('teachers')
export class TeacherAssignmentsController {
  constructor(private readonly assignmentsService: TeacherAssignmentsService) {}

  @ApiOperation({ summary: 'Lista global de asignaciones profesor-curso-asignatura con paginación y filtros' })
  @ApiOkResponse({ type: PaginatedTeacherAssignmentsResponse })
  @Get('assignments')
  async findAll(@Query() query: GetTeacherAssignmentsQueryRequest): Promise<PaginatedTeacherAssignmentsResponse> {
    const parsedFilters = query.filters ? parseTeacherAssignmentsFiltersString(query.filters) : {};
    const result = await this.assignmentsService.findAllWithFilters({
      page: query.page || 1,
      limit: query.limit || 10,
      ...parsedFilters,
    });

    return {
      data: result.data,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  @ApiOperation({ summary: 'Asigna un profesor a una asignatura dentro de un curso' })
  @ApiBody({ type: CreateTeacherAssignmentRequest })
  @ApiCreatedResponse({ type: TeacherAssignmentResponse })
  @ApiNotFoundResponse({ description: 'Profesor, curso o asignatura no encontrados' })
  @ApiConflictResponse({ description: 'Asignación duplicada o asignatura no asociada al curso' })
  @Post('assignments')
  async create(@Body() dto: CreateTeacherAssignmentRequest): Promise<TeacherAssignmentResponse> {
    return this.assignmentsService.create(dto);
  }

  @ApiOperation({ summary: 'Elimina una asignación curso-asignatura de un profesor' })
  @ApiBody({ type: DeleteTeacherAssignmentRequest })
  @ApiOkResponse({ description: 'Asignación eliminada' })
  @ApiNotFoundResponse({ description: 'Profesor o asignación no encontrados' })
  @HttpCode(200)
  @Delete('assignments')
  async delete(@Body() dto: DeleteTeacherAssignmentRequest): Promise<{ message: string }> {
    await this.assignmentsService.delete(dto.teacherId, dto.courseId, dto.subjectId);
    return { message: 'Teacher assignment deleted' };
  }

  @ApiOperation({ summary: 'Lista las asignaciones curso-asignatura de un profesor' })
  @ApiOkResponse({ type: TeacherAssignmentResponse, isArray: true })
  @ApiNotFoundResponse({ description: 'Profesor no encontrado' })
  @Get(':teacherId/assignments')
  async findByTeacherId(@Param('teacherId') teacherId: string): Promise<TeacherAssignmentResponse[]> {
    return this.assignmentsService.findByTeacherId(teacherId);
  }
}
