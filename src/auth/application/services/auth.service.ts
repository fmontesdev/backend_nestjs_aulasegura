import { Injectable, UnauthorizedException, NotFoundException, Inject } from '@nestjs/common';
import { compare as bcryptCompare, hash as bcryptHash } from '@node-rs/bcrypt';
import { UsersService } from '../../../users/application/services/users.service';
import { CreateUserDto } from '../../../users/application/dto/create-user.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { BlacklistTokenEntity } from '../../domain/entities/blacklist-token.entity';
import { PasswordResetTokenEntity } from '../../domain/entities/password-reset-token.entity';
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
      roles: dto.roles,
      avatar: dto.avatar,
      departmentId: dto.departmentId,
      validTo: dto.validTo,
    };
    
    return this.usersService.createUser(userDto);
  }

  /// Valida las credenciales del usuario y retorna el usuario si son correctas
  async validateUser(email: string, password: string): Promise<UserEntity | null> {
    // Obteniene el usuario por su email
    const user = await this.usersService.findUserByEmailOrFail(email);

    const isPasswordValid = await bcryptCompare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    // Verificar si el usuario está activo (validTo)
    if (user.validTo && user.validTo < new Date()) {
      throw new UnauthorizedException('User suspended');
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
        throw new UnauthorizedException('Token invalidated (logout)');
      }

      // Obteniene el usuario por su ID
      const user = await this.usersService.findUserByIdOrFail(payload.sub);

      // Verifica tokenVersion (logout masivo)
      if (payload.tokenVersion !== user.tokenVersion) {
        throw new UnauthorizedException('Token invalidated (version)');
      }

      // Verifica si el usuario está activo
      if (user.validTo && user.validTo < new Date()) {
        throw new UnauthorizedException('User deactivated');
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
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /// Cierra la sesión del usuario en un dispositivo específico y añade el refresh token a la blacklist
  async logout(userId: string, refreshToken: string): Promise<void> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token required');
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
      throw new UnauthorizedException('Error processing the refresh token');
    }
  }

  /// Invalida todos los tokens del usuario incrementando tokenVersion para los casos de: robo de dispositivo, cambio de contraseña, suspensión
  async revokeAllUserTokens(userId: string): Promise<void> {
    const user = await this.usersService.findUserByIdOrFail(userId); // Obtiene usuario
    try {
      user.tokenVersion++; // Incrementa tokenVersion para invalidar todos los tokens
      await this.usersService.saveUser(user);
    } catch (error) {
      throw new UnauthorizedException('Error revoking tokens');
    }
  }

  /// Cambio de contraseña con revocación de todos los tokens
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    // Obtiene usuario por su ID
    const user = await this.usersService.findUserByIdOrFail(userId);

    // Verifica contraseña actual
    const isValid = await bcryptCompare(oldPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Incorrect current password');
    }

    try {
      // Actualiza contraseña
      user.passwordHash = await bcryptHash(newPassword, 12);
      
      // Incrementa tokenVersion para invalidar todos los tokens
      user.tokenVersion++;
      
      await this.usersService.saveUser(user);
    } catch (error) {
      throw new UnauthorizedException('Error changing the password');
    }
  }

  /// Genera un código de recuperación y lo guarda (invalidando tokens anteriores)
  async requestPasswordReset(email: string): Promise<string> {
    // Obtiene usuario por su email
    const user = await this.usersService.findUserByEmail(email);
    
    // Por seguridad, no revelamos si el email existe o no
    if (!user) {
      return 'If the email exists, you will receive a recovery code';
    }

    // Invalida tokens anteriores del usuario
    await this.authRepo.invalidateUserPasswordResetTokens(user.userId);

    // Genera código alfanumérico de 6 caracteres
    const token = this.generateResetToken();
    
    // Expira en 20 minutos
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 20);

    // Crea el token de recuperación
    const resetToken = new PasswordResetTokenEntity();
    resetToken.token = token;
    resetToken.userId = user.userId;
    resetToken.expiresAt = expiresAt;
    resetToken.attempts = 0;
    resetToken.isUsed = false;
    resetToken.createdAt = new Date();

    await this.authRepo.savePasswordResetToken(resetToken);

    return 'If the email exists, you will receive a recovery code';
  }

  /// Valida el código de recuperación y cambia la contraseña
  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    // Obtiene usuario por su email
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Busca el token de recuperación comprobando que sea válido (isUsed: false, expiresAt > now)
    const resetToken = await this.authRepo.findPasswordResetToken(token, user.userId);
    if (!resetToken) {
      await this.incrementPasswordResetAttempts(user.userId);
      throw new UnauthorizedException('Invalid or expired code');
    }

    // Cambia la contraseña
    user.passwordHash = await bcryptHash(newPassword, 12);
    
    // Incrementa tokenVersion para invalidar todos los tokens JWT
    user.tokenVersion++;

    await this.usersService.saveUser(user);

    // Marca el token como usado e incrementa intentos
    resetToken.isUsed = true;
    resetToken.attempts++;
    await this.authRepo.savePasswordResetToken(resetToken);
  }

  /// Suspender cuenta de usuario
  async suspendUser(email: string): Promise<void> {
    // Obtiene usuario por su email
    const user = await this.usersService.findUserByEmailOrFail(email);

    try {
      user.validTo = new Date(); // Desactiva cuenta
      user.tokenVersion++; // Invalida todos los tokens
      
      await this.usersService.saveUser(user);
    } catch (error) {
      throw new UnauthorizedException('Error suspending the user');
    }
  }

  /// Obtiene el usuario actual basado en el payload del JWT
  async getCurrentUser(userId: string): Promise<UserEntity> {
    // Obtiene usuario por su ID
    const user = await this.usersService.findUserByIdOrFail(userId);

    // Verifica si el usuario está activo
    if (user.validTo && user.validTo < new Date()) {
      throw new UnauthorizedException('User deactivated');
    }

    return user;
  }

  //? ================= Métodos auxiliares =================

  //? Genera un código alfanumérico aleatorio de 6 caracteres
  private generateResetToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 6; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  //? Incrementa el contador de intentos fallidos para un token de recuperación
  private async incrementPasswordResetAttempts(userId: string): Promise<void> {
    // Obtiene el token de recuperación activo del usuario
    const resetToken = await this.authRepo.findPasswordResetTokenByUserId(userId);

    // Verifica intentos (máximo 5)
    if (resetToken != null && resetToken.attempts >= 5) {
      resetToken.isUsed = true; // Marca como usado para bloquearlo
      await this.authRepo.savePasswordResetToken(resetToken);
      throw new UnauthorizedException('Too many attempts. Please request a new code');
    }

    if (resetToken) {
      resetToken.attempts++;
      await this.authRepo.savePasswordResetToken(resetToken);
    }
  }
}
