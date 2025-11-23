import { Controller, Get, Body, Patch, Param, Delete, HttpCode, UseGuards, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../../application/services/users.service';
import { UpdateUserRequest } from '../dto/requests/update-user.request.dto';
import { UploadAvatarRequest } from '../dto/requests/upload-avatar.request.dto';
import { UserResponse } from '../dto/responses/user.response.dto';
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
import { AuthMapper } from '../../../auth/presentation/mappers/auth.mapper';

@ApiTags('users')
@ApiBearerAuth() // porque usamos auth tipo Bearer
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Lista de usuarios' })
  @ApiOkResponse({ type: UserResponse, isArray: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  @Get()
  async getUsers(): Promise<UserResponse[]> {
    const entities = await this.usersService.findAll();
    return UserMapper.toResponseList(entities);
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

    return AuthMapper.toAuthResponseWithoutTokens(updatedUser);
  }
}
