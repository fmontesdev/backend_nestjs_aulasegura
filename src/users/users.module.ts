import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './presentation/controllers/users.controller';
import { UsersService } from './application/services/users.service';
import { UserEntity } from './domain/entities/user.entity';
import { UsersRepository } from './domain/repositories/users.repository';
import { TypeormUsersRepository } from './Infraestructure/persistence/typeorm/typeorm-users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: UsersRepository, useClass: TypeormUsersRepository }, // <-- binding
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
