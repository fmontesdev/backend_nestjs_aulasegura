import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}


  /// Genera un access token JWT
  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
    } as any);
  }

  /// Genera un refresh token JWT
  generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
    } as any);
  }

  /// Verifica y decodifica un refresh token
  verifyRefreshToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  /// Decodifica un token sin verificar la firma (solo para cuando ya se validó el token)
  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  /// Extrae el userId (sub) de un token
  extractUserIdFromToken(token: string): string {
    const payload = this.decodeToken(token);
    if (!payload || !payload.sub) {
      throw new Error('Invalid token: missing sub');
    }
    return payload.sub;
  }

  /// Extrae la fecha de expiración de un token
  extractExpirationFromToken(token: string): Date {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      throw new Error('Invalid token: missing exp');
    }
    return new Date(payload.exp * 1000); // Multiplica por 1000 para convertir a milisegundos
  }
}
