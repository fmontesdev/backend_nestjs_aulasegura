import { Controller, Get, Body, Patch, Param, Delete, HttpCode, UseGuards, Post, UseInterceptors, UploadedFile, BadRequestException, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../../application/services/users.service';
import { UpdateUserRequest } from '../dto/requests/update-user.request.dto';
import { GetUsersQueryRequest } from '../dto/requests/get-users-query.request.dto';
import { UploadAvatarRequest } from '../dto/requests/upload-avatar.request.dto';
import { UserResponse } from '../dto/responses/user.response.dto';
import { PaginatedUsersResponse } from '../dto/responses/paginated-users.response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { RoleName } from '../../domain/enums/rolename.enum';
import { ApiBearerAuth, ApiOkResponse, ApiNotFoundResponse, ApiConflictResponse, ApiTags, ApiOperation, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { avatarUploadConfig } from '../../../utils/image-upload.config';
import { UploadAvatarDto } from '../../application/dto/upload-avatar.dto';
import { AuthResponse } from '../../../auth/presentation/dto/responses/auth.response.dto';
import { parseFiltersString } from '../utils/filters-parser.util';

@ApiTags('users')
@ApiBearerAuth() // porque usamos auth tipo Bearer
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Lista de usuarios con paginación y filtros' })
  @ApiOkResponse({ type: PaginatedUsersResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  @Get()
  async getUsers(@Query() query: GetUsersQueryRequest): Promise<PaginatedUsersResponse> {
    // Parsear filtros
    const parsedFilters = query.filters ? parseFiltersString(query.filters) : {};

    // Construir objeto de filtros
    const filters = {
      page: query.page || 1,
      limit: query.limit || 10,
      ...parsedFilters,
    };

    const result = await this.usersService.findAllWithFilters(filters);
    return UserMapper.toPaginatedResponse(result);
  }

  @ApiOperation({ summary: 'Detalle de usuario por ID' })
  @ApiOkResponse({ type: UserResponse })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponse> {
    const entity = await this.usersService.findOne(id);
    return UserMapper.toResponse(entity);
  }

  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiBody({ type: UpdateUserRequest })
  @ApiOkResponse({ type: UserResponse })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiConflictResponse({ description: 'El email ya está registrado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserRequest): Promise<UserResponse> {
    const entity = await this.usersService.update(id, dto);
    return UserMapper.toResponse(entity);
  }

  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiOkResponse({ description: 'Usuario eliminado' })
  @HttpCode(200) // Responde al eliminado con "200"
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: 'Usuario eliminado' };
  }

  @ApiOperation({ summary: 'Actualiza el avatar del usuario autenticado' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (JPG, JPEG, PNG, WebP) - máximo 5MB',
        },
        filename: {
          type: 'string',
          description: 'Nombre del archivo que se guardará',
          example: 'avatar_123.jpg',
        },
      },
      required: ['file', 'filename'],
    },
  })
  @ApiOkResponse({ type: AuthResponse })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @UseGuards(JwtAuthGuard)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file', avatarUploadConfig))
  async uploadAvatar(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadAvatarRequest,
  ): Promise<AuthResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const uploadDto = new UploadAvatarDto();
    uploadDto.filename = dto.filename;

    const updatedUser = await this.usersService.uploadAvatar(user.userId, file, uploadDto);

    return UserMapper.toResponse(updatedUser);
  }

  @ApiOperation({ summary: 'Actualiza el avatar de un usuario específico (solo admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (JPG, JPEG, PNG, WebP) - máximo 5MB',
        },
        filename: {
          type: 'string',
          description: 'Nombre del archivo que se guardará',
          example: 'avatar_123.jpg',
        },
      },
      required: ['file', 'filename'],
    },
  })
  @ApiOkResponse({ type: UserResponse })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  @Post(':id/upload-avatar')
  @UseInterceptors(FileInterceptor('file', avatarUploadConfig))
  async uploadAvatarForAdmin(
    @Param('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadAvatarRequest,
  ): Promise<UserResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const uploadDto = new UploadAvatarDto();
    uploadDto.filename = dto.filename;

    const updatedUser = await this.usersService.uploadAvatar(userId, file, uploadDto);

    return UserMapper.toResponse(updatedUser);
  }}