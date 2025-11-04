import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { compare as bcryptCompare, hash as bcryptHash } from '@node-rs/bcrypt';
import { UsersService } from '../../../users/application/services/users.service';
import { CreateUserDto } from '../../../users/application/dto/create-user.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { BlacklistTokenEntity } from '../../domain/entities/blacklist-token.entity';
import type { JwtPayload } from '../types/jwt-payload';
import type { AuthTokens } from '../types/auth-tokens';
import { JwtTokenService } from './jwt-token.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthRepository)
    private readonly authRepo: AuthRepository,
    private readonly jwtTokenService: JwtTokenService,
    private readonly usersService: UsersService,
  ) {}

  /// Registra un nuevo usuario
  async register(dto: RegisterDto): Promise<UserEntity> {
    const userDto: CreateUserDto = {
      name: dto.name,
      lastname: dto.lastname,
      email: dto.email,
      password: dto.password,
      roleName: dto.roleName,
      avatar: dto.avatar,
      departmentId: dto.departmentId,
    };
    
    return this.usersService.createUser(userDto);
  }

  /// Valida las credenciales del usuario y retorna el usuario si son correctas
  async validateUser(email: string, password: string): Promise<UserEntity | null> {
    // Obteniene el usuario por su email
    const user = await this.usersService.findUserByEmailOrFail(email);

    const isPasswordValid = await bcryptCompare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Verificar si el usuario está activo (validTo)
    if (user.validTo && user.validTo < new Date()) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    return user;
  }


  /// Genera tokens de acceso y refresh durante el login del usuario
  async login(user: UserEntity): Promise<AuthTokens> {
    const roleNames = user.roles ? user.roles.map(r => r.name) : [];

    const payload: JwtPayload = {
      sub: user.userId,
      email: user.email,
      roles: roleNames,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = this.jwtTokenService.generateAccessToken(payload);
    const refreshToken = this.jwtTokenService.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  /// Refresca el access token usando un refresh token válido
  async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verifica firma y expiración del refresh token
      const payload = this.jwtTokenService.verifyRefreshToken(refreshToken);

      // Verifica si está en blacklist (logout individual)
      const isBlacklisted = await this.authRepo.isTokenBlacklisted(refreshToken);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token invalidado (logout)');
      }

      // Obteniene el usuario por su ID
      const user = await this.usersService.findUserByIdOrFail(payload.sub);

      // Verifica tokenVersion (logout masivo)
      if (payload.tokenVersion !== user.tokenVersion) {
        throw new UnauthorizedException('Token invalidado (versión)');
      }

      // Verifica si el usuario está activo
      if (user.validTo && user.validTo < new Date()) {
        throw new UnauthorizedException('Usuario desactivado');
      }

      // Genera solo nuevo accessToken, mantiene el mismo refreshToken
      const roleNames = user.roles ? user.roles.map(r => r.name) : [];
      const newPayload: JwtPayload = {
        sub: user.userId,
        email: user.email,
        roles: roleNames,
        tokenVersion: user.tokenVersion,
      };

      const accessToken = this.jwtTokenService.generateAccessToken(newPayload);

      // Retorna el mismo refreshToken
      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  /// Cierra la sesión del usuario en un dispositivo específico y añade el refresh token a la blacklist
  async logout(userId: string, refreshToken: string): Promise<void> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token requerido');
    }

    try {
      // Combinado con una tarea cron limpiaria periódicamente los tokens expirados en la blacklist
      const expiresAt = this.jwtTokenService.extractExpirationFromToken(refreshToken);

      const blacklistToken = new BlacklistTokenEntity();
      blacklistToken.userId = userId;
      blacklistToken.token = refreshToken;
      blacklistToken.expiresAt = expiresAt;
      blacklistToken.createdAt = new Date();

      await this.authRepo.saveBlacklistToken(blacklistToken);
    } catch (error) {
      throw new UnauthorizedException('Error al procesar el refresh token');
    }
  }

  /// Invalida todos los tokens del usuario incrementando tokenVersion para los casos de: robo de dispositivo, cambio de contraseña, suspensión
  async revokeAllUserTokens(userId: string): Promise<void> {
    const user = await this.usersService.findUserByIdOrFail(userId); // Obtiene usuario
    user.tokenVersion++; // Incrementa tokenVersion para invalidar todos los tokens
    await this.usersService.saveUser(user);
  }

  /// Cambio de contraseña con revocación de todos los tokens
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    // Obtiene usuario por su ID
    const user = await this.usersService.findUserByIdOrFail(userId);

    // Verifica contraseña actual
    const isValid = await bcryptCompare(oldPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    // Actualiza contraseña
    user.passwordHash = await bcryptHash(newPassword, 12);
    
    // Incrementa tokenVersion para invalidar todos los tokens
    user.tokenVersion++;
    
    await this.usersService.saveUser(user);
  }

  /// Suspender cuenta de usuario
  async suspendUser(userId: string): Promise<void> {
    // Obtiene usuario por su ID
    const user = await this.usersService.findUserByIdOrFail(userId);

    user.validTo = new Date(); // Desactiva cuenta
    user.tokenVersion++; // Invalida todos los tokens
    
    await this.usersService.saveUser(user);
  }

  /// Obtiene el usuario actual basado en el payload del JWT
  async getCurrentUser(userId: string): Promise<UserEntity> {
    // Obtiene usuario por su ID
    const user = await this.usersService.findUserByIdOrFail(userId);

    // Verifica si el usuario está activo
    if (user.validTo && user.validTo < new Date()) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    return user;
  }
}
