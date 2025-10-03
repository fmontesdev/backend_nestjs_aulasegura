import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { UsersService } from '../../application/services/users.service';
import { CreateUserRequest } from '../dto/requests/create-user.request.dto';
import { UpdateUserRequest } from '../dto/requests/update-user.request.dto';
import { UserResponse } from '../dto/responses/user.response.dto';
import { ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse,
  ApiNotFoundResponse, ApiConflictResponse, ApiTags, ApiOperation
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth() // porque usamos auth tipo Bearer
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Lista de usuarios' })
  @ApiOkResponse({ type: UserResponse, isArray: true })
  @Get()
  getUsers(): Promise<UserResponse[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Detalle de usuario por ID' })
  @ApiOkResponse({ type: UserResponse })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserResponse> {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Crear usuario' })
  @ApiCreatedResponse({ type: UserResponse })
  @ApiConflictResponse({ description: 'El email ya está registrado' })
  @Post()
  createUser(@Body() dto: CreateUserRequest): Promise<UserResponse> {
    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiOkResponse({ type: UserResponse })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiConflictResponse({ description: 'El email ya está registrado' })
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserRequest): Promise<UserResponse> {
    return this.usersService.update(id, dto);
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
  deactivate(@Param('id') id: string): Promise<UserResponse> {
    return this.usersService.softRemove(id);
  }
}
