import { Injectable } from '@nestjs/common';
import type { Response } from 'express';

@Injectable()
export class CookieService {
  setRefreshCookie(res: Response, token: string): void {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      path: '/auth',
    });
  }

  clearRefreshCookie(res: Response): void {
    res.clearCookie('refresh_token', { path: '/auth' });
  }
}
