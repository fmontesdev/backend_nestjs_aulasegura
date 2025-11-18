import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, HttpCode, HttpStatus, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth, ApiParam,
  ApiBody, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse
} from '@nestjs/swagger';
import { AccessService } from '../../application/services/access.service';
import { RfidNfcAccessCheckRequest } from '../dto/requests/rfid-nfc-access-check.request.dto';
import { QrAccessCheckRequest } from '../dto/requests/qr-access-check.request.dto';
import { AccessLogResponse } from '../dto/responses/access-log.response.dto';
import { AccessCheckResponse } from '../dto/responses/access-check.response.dto';
import { AccessLogMapper } from '../mappers/access-log.mapper';
import { AccessCheckMapper } from '../mappers/access-check.mapper';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { RoleName } from '../../../users/domain/enums/rolename.enum';

@ApiTags('access')
@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @ApiOperation({ summary: 'Lista todos los registros de acceso' })
  @ApiOkResponse({ type: [AccessLogResponse] })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'Prohibido. Requiere rol ADMIN' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  @Get('logs')
  async findAll(): Promise<AccessLogResponse[]> {
    const accessLogs = await this.accessService.findAll();
    return AccessLogMapper.toResponseList(accessLogs);
  }

  @ApiOperation({ summary: 'Muestra un registro de acceso por ID' })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID del registro de acceso', example: 1 })
  @ApiOkResponse({ type: AccessLogResponse })
  @ApiNotFoundResponse({ description: 'Registro de acceso no encontrado' })
  @ApiBadRequestResponse({ description: 'El parámetro id debe ser un entero' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'Prohibido. Requiere rol ADMIN' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  @Get('logs/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AccessLogResponse> {
    const accessLog = await this.accessService.findOne(id);
    return AccessLogMapper.toResponse(accessLog);
  }

  @ApiOperation({
    summary: 'Valida el acceso de un usuario a un aula a través de lectores RFID/NFC',
    description: 'Endpoint para lectores RFID/NFC. Valida permisos a una aula y registra el intento proporcionando rawUid del tag y el código del lector'
  })
  @ApiBody({ type: RfidNfcAccessCheckRequest })
  @ApiOkResponse({ description: 'Acceso permitido', type: AccessCheckResponse })
  @ApiForbiddenResponse({ description: 'Acceso denegado, sin permisos válidos' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o falta rawUid' })
  @UseGuards(JwtAuthGuard)
  @Post('check')
  async rfidNfcAccessCheck(@Body() requestDto: RfidNfcAccessCheckRequest, @CurrentUser() currentUser: any): Promise<AccessCheckResponse> {
    const [permission, accessStatus, reasonStatus] = await this.accessService.rfidNfcAccessCheck(requestDto, currentUser);
    
    // Si el acceso es denegado, devolver 403 Forbidden
    if (accessStatus === 'denied') {
      throw new ForbiddenException({
        permission: null,
        accessStatus: 'denied',
        reasonStatus
      });
    }
    
    return AccessCheckMapper.toResponse(permission, accessStatus, reasonStatus);
  }

  @ApiOperation({
    summary: 'Valida el acceso de un usuario a un aula solo a través de QR',
    description: 'Valida permisos a un aula y registra el intento proporcionando el usuario autenticado y el código del lector por QR'
  })
  @ApiBody({ type: QrAccessCheckRequest })
  @ApiOkResponse({ description: 'Acceso permitido', type: AccessCheckResponse })
  @ApiForbiddenResponse({ description: 'Acceso denegado, sin permisos válidos' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @UseGuards(JwtAuthGuard)
  @Post('qrcheck')
  async qrAccessCheck(@Body() requestDto: QrAccessCheckRequest, @CurrentUser() currentUser: any): Promise<AccessCheckResponse> {
    const [permission, accessStatus, reasonStatus] = await this.accessService.qrAccessCheck(requestDto, currentUser);
    
    // Si el acceso es denegado, devolver 403 Forbidden
    if (accessStatus === 'denied') {
      throw new ForbiddenException({
        permission: null,
        accessStatus: 'denied',
        reasonStatus
      });
    }
    
    return AccessCheckMapper.toResponse(permission, accessStatus, reasonStatus);
  }
}
