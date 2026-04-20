import { Injectable } from '@nestjs/common';
import type { Response } from 'express';

@Injectable()
export class CookieService {
  private parseExpiration(value: string | undefined, fallbackMs: number): number {
    // Si value es undefined o un string vacío, devuelve el valor de fallbackMs
    if (!value) return fallbackMs;
    // Interpreta el valor de expiración en formato como "15m", "1h", "7d", etc
    // Devuelve un array con la expresión original, el número y la unidad de tiempo
    const match = value.match(/^(\d+)(s|m|h|d)$/);
    // Si match es null, el formato es inválido, devuelve fallbackMs
    if (!match) return fallbackMs;
    const num = parseInt(match[1], 10);
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    return num * multipliers[match[2]];
  }

  setRefreshCookie(res: Response, token: string): void {
    const maxAge = this.parseExpiration(
      process.env.JWT_REFRESH_EXPIRATION,
      7 * 24 * 60 * 60 * 1000,
    );
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth',
      maxAge,
    });
  }

  clearRefreshCookie(res: Response): void {
    res.clearCookie('refresh_token', { path: '/auth' });
  }

  setAccessCookie(res: Response, token: string): void {
    const maxAge = this.parseExpiration(
      process.env.JWT_ACCESS_EXPIRATION,
      15 * 60 * 1000,
    );
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge,
    });
  }

  clearAccessCookie(res: Response): void {
    res.clearCookie('access_token', { path: '/' });
  }
}
