import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './presentation/controllers/users.controller';
import { UsersService } from './application/services/users.service';
import { UserEntity } from './domain/entities/user.entity';
import { TeacherEntity } from './domain/entities/teacher.entity';
import { RoleEntity } from './domain/entities/role.entity';
import { UsersRepository } from './domain/repositories/users.repository';
import { TypeormUsersRepository } from './Infraestructure/persistence/typeorm/typeorm-users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TeacherEntity, RoleEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: UsersRepository, useClass: TypeormUsersRepository }, // binding
  ],
  exports: [UsersService],
})
export class UsersModule {}
