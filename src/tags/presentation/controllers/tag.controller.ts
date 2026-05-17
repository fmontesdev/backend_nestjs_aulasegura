import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth, ApiParam, ApiBody, ApiUnauthorizedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { TagService } from '../../application/services/tag.service';
import { CreateTagRequest } from '../dto/requests/create-tag.request.dto';
import { CreateAdminTagRequest } from '../dto/requests/create-admin-tag.request.dto';
import { GetTagsQueryRequest } from '../dto/requests/get-tags-query.request.dto';
import { UpdateTagRequest } from '../dto/requests/update-tag.request.dto';
import { TagResponse } from '../dto/responses/tag.response.dto';
import { PaginatedTagsResponse } from '../dto/responses/paginated-tags.response.dto';
import { TagMapper } from '../mappers/tag.mapper';
import { parseFiltersString } from '../utils/filters-parser.util';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';
import type { AuthenticatedUser } from '../../../auth/presentation/types/authenticated-user';

@ApiTags('tags')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido. Permisos insuficientes' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: 'Lista credenciales con paginación y filtros' })
  @ApiOkResponse({ type: PaginatedTagsResponse })
  @Roles(RoleName.ADMIN)
  @Get()
  async findAll(@Query() query: GetTagsQueryRequest): Promise<PaginatedTagsResponse> {
    const parsedFilters = query.filters ? parseFiltersString(query.filters) : {};
    const result = await this.tagService.findAllWithFilters({
      page: query.page || 1,
      limit: query.limit || 10,
      ...parsedFilters,
    });

    return TagMapper.toPaginatedResponse(result);
  }

  @ApiOperation({ summary: 'Muestra un tag por ID' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del tag', example: 1 })
  @ApiOkResponse({ type: TagResponse })
  @ApiNotFoundResponse({ description: 'Tag no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN, RoleName.TEACHER)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TagResponse> {
    const tag = await this.tagService.findOne(id);
    return TagMapper.toResponse(tag);
  }

  @ApiOperation({ 
    summary: 'Crea un nuevo tag para el usuario autenticado',
    description: 'Genera internamente el código seguro de la credencial. Para credenciales NFC físicas requiere rawUid; para NFC móvil genera y devuelve mobileCredential una sola vez.'
  })
  @ApiBody({ type: CreateTagRequest })
  @ApiCreatedResponse({ description: 'Tag creado con éxito', type: TagResponse })
  @ApiConflictResponse({ description: 'Ya existe un tag con este código' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o raw_uid faltante para RFID' })
  @Roles(RoleName.ADMIN, RoleName.TEACHER, RoleName.JANITOR, RoleName.SUPPORT_STAFF)
  @Post()
  async create(@CurrentUser() currentUser: AuthenticatedUser, @Body() requestDto: CreateTagRequest): Promise<TagResponse> {
    const result = await this.tagService.create({
      userId: currentUser.userId,
      type: requestDto.type,
      rawUid: requestDto.rawUid,
    });
    return TagMapper.toResponse(result.tag, result.mobileCredential);
  }

  @ApiOperation({
    summary: 'Crea una credencial para cualquier usuario',
    description: 'ADMIN only. RFID requiere rawUid; nfc_mobile genera y devuelve mobileCredential una sola vez.',
  })
  @ApiBody({ type: CreateAdminTagRequest })
  @ApiCreatedResponse({ description: 'Credencial creada con éxito', type: TagResponse })
  @ApiConflictResponse({ description: 'Ya existe una credencial con este código' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o rawUid faltante para RFID' })
  @Roles(RoleName.ADMIN)
  @Post('admin')
  async createAdmin(@Body() requestDto: CreateAdminTagRequest): Promise<TagResponse> {
    const result = await this.tagService.create({
      userId: requestDto.userId,
      type: requestDto.type,
      rawUid: requestDto.rawUid,
    });

    return TagMapper.toResponse(result.tag, result.mobileCredential);
  }

  @ApiOperation({ 
    summary: 'Regenera una credencial NFC física',
    description: 'ADMIN only. Solo acepta rawUid y regenera internamente el código seguro de credenciales NFC físicas (type=rfid). No cambia usuario ni tipo.'
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del tag a actualizar', example: 1 })
  @ApiBody({ type: UpdateTagRequest })
  @ApiOkResponse({ description: 'Credencial NFC física regenerada con éxito', type: TagResponse })
  @ApiNotFoundResponse({ description: 'Tag no encontrado' })
  @ApiConflictResponse({ description: 'Ya existe un tag con el nuevo código' })
  @ApiBadRequestResponse({ description: 'Datos inválidos, rawUid faltante, credencial nfc_mobile no regenerable o el parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Patch(':id')
  async updateTagCode(@Param('id', ParseIntPipe) id: number, @Body() requestDto: UpdateTagRequest): Promise<TagResponse> {
    const tag = await this.tagService.updateTagCode(id, requestDto);
    return TagMapper.toResponse(tag);
  }

  @ApiOperation({ summary: 'Desactiva un tag (soft delete)', description: 'Establece isActive en false para el tag especificado' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del tag a desactivar', example: 1 })
  @ApiOkResponse({
    description: 'Credencial desactivada con éxito',
    schema: { type: 'object', properties: { message: { type: 'string', example: 'Credencial desactivada con éxito' } } },
  })
  @ApiNotFoundResponse({ description: 'Tag no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Delete(':id')
  async softRemove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.tagService.softRemove(id);
    return { message: 'Credencial desactivada con éxito' };
  }
}
