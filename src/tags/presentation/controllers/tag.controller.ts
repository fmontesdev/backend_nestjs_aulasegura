import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth, ApiParam, ApiBody, ApiUnauthorizedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { TagService } from '../../application/services/tag.service';
import { CreateTagRequest } from '../dto/requests/create-tag.request.dto';
import { UpdateTagRequest } from '../dto/requests/update-tag.request.dto';
import { TagResponse } from '../dto/responses/tag.response.dto';
import { TagMapper } from '../mappers/tag.mapper';
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

  @ApiOperation({ summary: 'Lista todos los tags activos' })
  @ApiOkResponse({ type: [TagResponse] })
  @Roles(RoleName.ADMIN)
  @Get()
  async findAll(): Promise<TagResponse[]> {const tags = await this.tagService.findAll();
    return TagMapper.toResponseList(tags);
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
    description: 'Genera automáticamente el tagCode según el tipo. Para RFID requiere raw_uid, para NFC genera aleatorio.'
  })
  @ApiBody({ type: CreateTagRequest })
  @ApiCreatedResponse({ description: 'Tag creado con éxito', type: TagResponse })
  @ApiConflictResponse({ description: 'Ya existe un tag con este código' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o raw_uid faltante para RFID' })
  @Roles(RoleName.ADMIN, RoleName.TEACHER, RoleName.JANITOR, RoleName.SUPPORT_STAFF)
  @Post()
  async create(@CurrentUser() currentUser: AuthenticatedUser, @Body() requestDto: CreateTagRequest): Promise<TagResponse> {
    const tag = await this.tagService.create({
      userId: currentUser.userId,
      type: requestDto.type,
      rawUid: requestDto.rawUid,
    });
    return TagMapper.toResponse(tag);
  }

  @ApiOperation({ 
    summary: 'Actualiza un tag existente',
    description: 'Permite cambiar el usuario, tipo (regenera tagCode) o regenerar tagCode con nuevo raw_uid'
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del tag a actualizar', example: 1 })
  @ApiBody({ type: UpdateTagRequest })
  @ApiOkResponse({ description: 'Tag actualizado con éxito', type: TagResponse })
  @ApiNotFoundResponse({ description: 'Tag no encontrado' })
  @ApiConflictResponse({ description: 'Ya existe un tag con el nuevo código' })
  @ApiBadRequestResponse({ description: 'Datos inválidos, raw_uid faltante para RFID o el parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Patch(':id')
  async updateTagCode(@Param('id', ParseIntPipe) id: number, @Body() requestDto: UpdateTagRequest): Promise<TagResponse> {
    const tag = await this.tagService.updateTagCode(id, requestDto);
    return TagMapper.toResponse(tag);
  }

  @ApiOperation({ summary: 'Desactiva un tag (soft delete)', description: 'Establece isActive en false para el tag especificado' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del tag a desactivar', example: 1 })
  @ApiOkResponse({
    description: 'Tag desactivado con éxito',
    schema: { type: 'object', properties: { message: { type: 'string', example: 'Tag desactivado con éxito' } } },
  })
  @ApiNotFoundResponse({ description: 'Tag no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @Roles(RoleName.ADMIN)
  @Delete(':id')
  async softRemove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.tagService.softRemove(id);
    return { message: 'Tag deactivated successfully' };
  }
}
