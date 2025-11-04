import { Controller, Post, Body, Get, UseGuards, Req, HttpCode, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth, ApiBody, ApiUnauthorizedResponse, ApiConflictResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service';
import { JwtTokenService } from '../../application/services/jwt-token.service';
import { RegisterRequest } from '../dto/requests/register.request.dto';
import { LoginRequest } from '../dto/requests/login.request.dto';
import type { AuthenticatedRequest } from '../types/authenticated-request';
import type { AuthenticatedUser } from '../types/authenticated-user';
import { RefreshTokenRequest } from '../dto/requests/refresh-token.request.dto';
import { AuthResponse } from '../dto/responses/auth.response.dto';
import { AuthMapper } from '../mappers/auth.mapper';
import { Public } from '../../infrastructure/decorators/public.decorator';
import { CurrentUser } from '../../infrastructure/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../infrastructure/guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  @ApiOperation({ summary: 'Registrar nuevo usuario', description: 'Crea una nueva cuenta de usuario. Si el rol es teacher, debe incluir departmentId.' })
  @ApiCreatedResponse({ description: 'Usuario registrado exitosamente', type: AuthResponse })
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
      roleName: requestDto.roleName,
      avatar: requestDto.avatar,
      departmentId: requestDto.departmentId,
    });

    return AuthMapper.toAuthResponseWithoutTokens(user);
  }

  @ApiOperation({ summary: 'Inicia sesión', description: 'Autentica al usuario con email y contraseña y devuelve los tokens de acceso y refresh' })
  @ApiOkResponse({ description: 'Login exitoso', type: AuthResponse })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  @ApiBody({ type: LoginRequest })
  @HttpCode(200)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: AuthenticatedRequest): Promise<AuthResponse> {
    const user = req.user;
    const tokens = await this.authService.login(user);

    return AuthMapper.toAuthResponse(user, tokens);
  }

  @ApiOperation({ summary: 'Refresca access token', description: 'Obtiene un nuevo access token usando un refresh token válido' })
  @ApiOkResponse({ description: 'Token refrescado exitosamente', type: AuthResponse })
  @ApiUnauthorizedResponse({ description: 'Refresh token inválido o expirado' })
  @ApiBody({ type: RefreshTokenRequest })
  @HttpCode(200)
  @Public()
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenRequest): Promise<AuthResponse> {
    const tokens = await this.authService.refreshAccessToken(dto.refreshToken);
    const userId = this.jwtTokenService.extractUserIdFromToken(tokens.accessToken);
    const user = await this.authService.getCurrentUser(userId);

    return AuthMapper.toAuthResponse(user, tokens);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cierra sesión', description: 'Invalida el refresh token del dispositivo actual añadiéndolo a la blacklist' })
  @ApiOkResponse({ description: 'Logout exitoso' })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiBadRequestResponse({ description: 'Refresh token requerido' })
  @ApiBody({ 
    schema: { type: 'object', properties: { refreshToken: { type: 'string' } }, required: ['refreshToken'] },
    description: 'El refreshToken que se desea invalidar (obligatorio)'
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: AuthenticatedUser, @Body() body: { refreshToken: string }): Promise<{ message: string }> {
    if (!body.refreshToken) {
      throw new BadRequestException('Refresh token requerido para cerrar sesión');
    }
    
    await this.authService.logout(user.userId, body.refreshToken);
    return { message: 'Sesión cerrada' };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invalida todos los tokens', description: 'Cierra sesión en todos los dispositivos del usuario' })
  @ApiOkResponse({ description: 'Todos los tokens invalidados' })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(@CurrentUser() user: AuthenticatedUser): Promise<{ message: string }> {
    await this.authService.revokeAllUserTokens(user.userId);
    return { message: 'Sesión cerrada en todos los dispositivos' };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambia contraseña', description: 'Cambia la contraseña e invalida todos los tokens' })
  @ApiOkResponse({ description: 'Contraseña actualizada' })
  @ApiUnauthorizedResponse({ description: 'Contraseña actual incorrecta' })
  @ApiBody({ 
    schema: { type: 'object', properties: { oldPassword: { type: 'string' }, newPassword: { type: 'string' } }, required: ['oldPassword', 'newPassword'] },
    description: 'Proporciona la contraseña actual y la nueva contraseña para el cambio'
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@CurrentUser() user: AuthenticatedUser, @Body() body: { oldPassword: string; newPassword: string }): Promise<{ message: string }> {
    await this.authService.changePassword(user.userId, body.oldPassword, body.newPassword);
    return { message: 'Contraseña actualizada. Inicia sesión nuevamente en todos tus dispositivos' };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtiene usuario autenticado' })
  @ApiOkResponse({ description: 'Usuario autenticado', type: AuthResponse })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() currentUser: AuthenticatedUser): Promise<AuthResponse> {
    const user = await this.authService.getCurrentUser(currentUser.userId);
    return AuthMapper.toAuthResponseWithoutTokens(user);
  }
}
