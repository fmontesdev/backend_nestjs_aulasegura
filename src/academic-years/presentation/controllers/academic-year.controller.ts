import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth, ApiParam, ApiBody, ApiUnauthorizedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse, ApiBadRequestResponse,} from '@nestjs/swagger';
import { AcademicYearService } from '../../application/services/academic-year.service';
import { CreateAcademicYearRequest } from '../dto/requests/create-academic-year.request.dto';
import { AcademicYearResponse } from '../dto/responses/academic-year.response.dto';
import { AcademicYearMapper } from '../mappers/academic-year.mapper';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

@ApiTags('academic-years')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido. Permisos insuficientes, requiere rol ADMIN' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic-years')
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) {}

  @ApiOperation({ summary: 'Lista los años académicos que están activos' })
  @ApiOkResponse({ type: [AcademicYearResponse] })
  @Roles(RoleName.ADMIN)
  @Get()
  async findAll(): Promise<AcademicYearResponse[]> {
    const academicYears = await this.academicYearService.findAll();
    return AcademicYearMapper.toResponseList(academicYears);
  }

  @ApiOperation({ summary: 'Muestra un año académico por ID' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del año académico', example: 1 })
  @ApiOkResponse({ type: AcademicYearResponse })
  @ApiNotFoundResponse({ description: 'Año académico no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AcademicYearResponse> {
    const academicYear = await this.academicYearService.findOne(id);
    return AcademicYearMapper.toResponse(academicYear);
  }

  @ApiOperation({ summary: 'Crea un nuevo año académico con el formato YYYY-YYYY' })
  @ApiBody({ type: CreateAcademicYearRequest })
  @ApiCreatedResponse({ description: 'Año académico creado con éxito', type: AcademicYearResponse })
  @ApiConflictResponse({ description: 'Ya existe un año académico con este código' })
  @ApiBadRequestResponse({ description: 'Formato de código inválido (debe ser YYYY-YYYY)' })
  @Roles(RoleName.ADMIN)
  @Post()
  async create(@Body() requestDto: CreateAcademicYearRequest): Promise<AcademicYearResponse> {
    const academicYear = await this.academicYearService.create({code: requestDto.code});
    return AcademicYearMapper.toResponse(academicYear);
  }

  @ApiOperation({ summary: 'Desactiva un año académico (soft delete)', description: 'Establece isActive en false para el año académico especificado' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del año académico a desactivar', example: 1 })
  @ApiOkResponse({
    description: 'Año académico desactivado con éxito',
    schema: { type: 'object', properties: { message: { type: 'string', example: 'Año académico desactivado con éxito' } } },
  })
  @ApiNotFoundResponse({ description: 'Año académico no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Delete(':id')
  async softRemove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.academicYearService.softRemove(id);
    return { message: 'Academic year deactivated successfully' };
  }
}
