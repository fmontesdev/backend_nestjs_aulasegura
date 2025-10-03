import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { UsersService } from '../../application/services/users.service';
import { CreateUserRequest } from '../dto/requests/create-user.request.dto';
import { UpdateUserRequest } from '../dto/requests/update-user.request.dto';
import { UserResponse } from '../dto/responses/user.response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(): Promise<UserResponse[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserResponse> {
    return this.usersService.findOne(id);
  }

  @Post()
  createUser(@Body() dto: CreateUserRequest): Promise<UserResponse> {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserRequest): Promise<UserResponse> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204) // Responde al eliminado con "204 No Content"
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }

  @Patch('deactivate/:id')
  deactivate(@Param('id') id: string): Promise<UserResponse> {
    return this.usersService.softRemove(id);
  }
}
