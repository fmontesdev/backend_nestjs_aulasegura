import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './presentation/controllers/users.controller';
import { UsersService } from './application/services/users.service';
import { UserEntity } from './domain/entities/user.entity';
import { TeacherEntity } from './domain/entities/teacher.entity';
import { RoleEntity } from './domain/entities/role.entity';
import { RefreshTokenEntity } from './domain/entities/refresh-token.entity';
import { BlacklistTokenEntity } from './domain/entities/blacklist-token.entity';
import { UsersRepository } from './domain/repositories/users.repository';
import { TypeormUsersRepository } from './Infraestructure/persistence/typeorm/typeorm-users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TeacherEntity, RoleEntity, RefreshTokenEntity, BlacklistTokenEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: UsersRepository, useClass: TypeormUsersRepository }, // <-- binding
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
