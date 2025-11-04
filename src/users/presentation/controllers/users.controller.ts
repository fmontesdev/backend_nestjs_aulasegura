import { Controller, Get, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { UsersService } from '../../application/services/users.service';
import { UpdateUserRequest } from '../dto/requests/update-user.request.dto';
import { UserResponse } from '../dto/responses/user.response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleName } from '../../domain/enums/rolename.enum';
import { ApiBearerAuth, ApiOkResponse, ApiNotFoundResponse, ApiConflictResponse, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

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
}
