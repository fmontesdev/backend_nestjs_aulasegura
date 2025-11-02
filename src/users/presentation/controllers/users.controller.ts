import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { UsersService } from '../../application/services/users.service';
import { CreateUserRequest } from '../dto/requests/create-user.request.dto';
import { UpdateUserRequest } from '../dto/requests/update-user.request.dto';
import { UserResponse } from '../dto/responses/user.response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse,
  ApiNotFoundResponse, ApiConflictResponse, ApiTags, ApiOperation
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth() // porque usamos auth tipo Bearer
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @ApiOperation({ summary: 'Lista de usuarios' })
  // @ApiOkResponse({ type: UserResponse, isArray: true })
  @Get()
  async getUsers(): Promise<UserResponse[]> {
    const entities = await this.usersService.findAll();
    return UserMapper.toResponseList(entities);
  }

  @ApiOperation({ summary: 'Detalle de usuario por ID' })
  @ApiOkResponse({ type: UserResponse })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponse> {
    const entity = await this.usersService.findOne(id);
    return UserMapper.toResponse(entity);
  }

  @ApiOperation({ summary: 'Crear usuario' })
  @ApiCreatedResponse({ type: UserResponse })
  @ApiConflictResponse({ description: 'El email ya está registrado' })
  @Post()
  async createUser(@Body() dto: CreateUserRequest): Promise<UserResponse> {
    const entity = await this.usersService.create(dto);
    return UserMapper.toResponse(entity);
  }

  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiOkResponse({ type: UserResponse })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiConflictResponse({ description: 'El email ya está registrado' })
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserRequest): Promise<UserResponse> {
    const entity = await this.usersService.update(id, dto);
    return UserMapper.toResponse(entity);
  }

  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiNoContentResponse()
  @Delete(':id')
  @HttpCode(204) // Responde al eliminado con "204 No Content"
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }

  @ApiOperation({ summary: 'Desactivar usuario' })
  @ApiOkResponse({ type: UserResponse })
  @Patch('deactivate/:id')
  async deactivate(@Param('id') id: string): Promise<UserResponse> {
    const entity = await this.usersService.softRemove(id);
    return UserMapper.toResponse(entity);
  }
}
