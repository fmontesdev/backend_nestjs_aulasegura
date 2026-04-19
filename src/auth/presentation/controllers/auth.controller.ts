import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
  HttpCode,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service';
import { JwtTokenService } from '../../application/services/jwt-token.service';
import { CookieService } from '../services/cookie.service';
import { RegisterRequest } from '../dto/requests/register.request.dto';
import { LoginRequest } from '../dto/requests/login.request.dto';
import { ForgotPasswordRequest } from '../dto/requests/forgot-password.request.dto';
import { ResetPasswordRequest } from '../dto/requests/reset-password.request.dto';
import type { AuthenticatedRequest } from '../types/authenticated-request';
import type { AuthenticatedUser } from '../types/authenticated-user';
import { AuthResponse } from '../dto/responses/auth.response.dto';
import { AuthMapper } from '../mappers/auth.mapper';
import { Public } from '../../infrastructure/decorators/public.decorator';
import { CurrentUser } from '../../infrastructure/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../infrastructure/guards/local-auth.guard';
import { RolesGuard } from '../../infrastructure/guards/roles.guard';
import { Roles } from '../../infrastructure/decorators/roles.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';
import type { Response, Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly cookieService: CookieService,
  ) {}

  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario. Si el rol es teacher, debe incluir departmentId.',
  })
  @ApiCreatedResponse({
    description: 'Usuario registrado exitosamente',
    type: AuthResponse,
  })
  @ApiConflictResponse({ description: 'El email ya está registrado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o departmentId faltante para teacher' })
  @ApiBody({ type: RegisterRequest })
  @Public()
  @Post('register')
  async register(@Body() requestDto: RegisterRequest): Promise<AuthResponse> {
    const user = await this.authService.register({
      name: requestDto.name,
      lastname: requestDto.lastname,
      email: requestDto.email,
      password: requestDto.password,
      roles: requestDto.roles,
      avatar: requestDto.avatar,
      departmentId: requestDto.departmentId,
      validTo: requestDto.validTo,
    });

    return AuthMapper.toAuthResponseWithoutTokens(user);
  }

  @ApiOperation({
    summary: 'Inicia sesión',
    description: 'Autentica al usuario con email y contraseña y devuelve los tokens de acceso y refresh',
  })
  @ApiOkResponse({ description: 'Login exitoso', type: AuthResponse })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  @ApiBody({ type: LoginRequest })
  @HttpCode(200)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const user = req.user;
    const tokens = await this.authService.login(user);
    this.cookieService.setRefreshCookie(res, tokens.refreshToken);
    return AuthMapper.toAuthResponse(user, { accessToken: tokens.accessToken });
  }

  @ApiOperation({
    summary: 'Refresca access token',
    description: 'Obtiene un nuevo access token usando un refresh token válido',
  })
  @ApiOkResponse({
    description: 'Token refrescado exitosamente',
    type: AuthResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Refresh token inválido o expirado' })
  @HttpCode(200)
  @Public()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token requerido');
    const tokens = await this.authService.refreshAccessToken(refreshToken);
    const userId = this.jwtTokenService.extractUserIdFromToken(tokens.accessToken);
    const user = await this.authService.getCurrentUser(userId);
    this.cookieService.setRefreshCookie(res, tokens.refreshToken);
    return AuthMapper.toAuthResponse(user, { accessToken: tokens.accessToken });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cierra sesión',
    description: 'Invalida el refresh token del dispositivo actual añadiéndolo a la blacklist',
  })
  @ApiOkResponse({ description: 'Logout exitoso' })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiBadRequestResponse({ description: 'Refresh token requerido' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new BadRequestException('Refresh token no encontrado');
    }
    await this.authService.logout(user.userId, refreshToken);
    this.cookieService.clearRefreshCookie(res);
    return { message: 'Sesión cerrada' };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Invalida todos los tokens',
    description: 'Cierra sesión en todos los dispositivos del usuario',
  })
  @ApiOkResponse({ description: 'Todos los tokens invalidados' })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ message: string }> {
    await this.authService.revokeAllUserTokens(user.userId);
    return { message: 'Sesión cerrada en todos los dispositivos' };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cambia contraseña',
    description: 'Cambia la contraseña e invalida todos los tokens',
  })
  @ApiOkResponse({ description: 'Contraseña actualizada' })
  @ApiUnauthorizedResponse({ description: 'Contraseña actual incorrecta' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
      required: ['oldPassword', 'newPassword'],
    },
    description: 'Proporciona la contraseña actual y la nueva contraseña para el cambio',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { oldPassword: string; newPassword: string },
  ): Promise<{ message: string }> {
    await this.authService.changePassword(user.userId, body.oldPassword, body.newPassword);
    return {
      message: 'Contraseña actualizada. Inicia sesión nuevamente en todos tus dispositivos',
    };
  }

  @ApiOperation({
    summary: 'Solicitar recuperación de contraseña',
    description: 'Genera un código de recuperación y lo envía por email (futuro)',
  })
  @ApiOkResponse({ description: 'Código de recuperación generado' })
  @ApiBadRequestResponse({ description: 'Email inválido' })
  @ApiBody({ type: ForgotPasswordRequest })
  @HttpCode(200)
  @Public()
  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: ForgotPasswordRequest,
  ): Promise<{ message: string }> {
    const message = await this.authService.requestPasswordReset(dto.email);
    return { message };
  }

  @ApiOperation({
    summary: 'Restablecer contraseña',
    description: 'Valida el código de recuperación y cambia la contraseña',
  })
  @ApiOkResponse({ description: 'Contraseña restablecida correctamente' })
  @ApiUnauthorizedResponse({ description: 'Código inválido o expirado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiBody({ type: ResetPasswordRequest })
  @HttpCode(200)
  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordRequest,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(dto.email, dto.resetToken, dto.newPassword);
    return { message: 'Contraseña restablecida correctamente' };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Suspende cuenta de usuario',
    description: 'Suspende la cuenta del usuario y revoca todos los tokens',
  })
  @ApiOkResponse({ description: 'Cuenta suspendida' })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  @Post('suspend')
  async suspendUser(
    @Body() body: { email: string },
  ): Promise<{ message: string }> {
    await this.authService.suspendUser(body.email);
    return {
      message: `Cuenta suspendida del usuario con email: ${body.email}`,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtiene usuario autenticado' })
  @ApiOkResponse({ description: 'Usuario autenticado', type: AuthResponse })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<AuthResponse> {
    const user = await this.authService.getCurrentUser(currentUser.userId);
    return AuthMapper.toAuthResponseWithoutTokens(user);
  }
}
