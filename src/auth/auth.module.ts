import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { BlacklistTokenEntity } from './domain/entities/blacklist-token.entity';
import { PasswordResetTokenEntity } from './domain/entities/password-reset-token.entity';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './application/services/auth.service';
import { JwtTokenService } from './application/services/jwt-token.service';
import { JwtStrategy } from './application/strategies/jwt.strategy';
import { LocalStrategy } from './application/strategies/local.strategy';
import { AuthRepository } from './domain/repositories/auth.repository';
import { TypeormAuthRepository } from './infrastructure/persistence/typeorm/typeorm-auth.repository';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_ACCESS_EXPIRATION')) as any,
        },
      }),
    }),
    TypeOrmModule.forFeature([BlacklistTokenEntity, PasswordResetTokenEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtTokenService,
    JwtStrategy,
    LocalStrategy,
    { provide: AuthRepository, useClass: TypeormAuthRepository }, // binding
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
