import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth, ApiParam,
  ApiBody, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse
} from '@nestjs/swagger';
import { AccessService } from '../../application/services/access.service';
import { CreateAccessLogRequest } from '../dto/requests/create-access-log.request.dto';
import { CheckAccessRequest } from '../dto/requests/check-access.request.dto';
import { AccessLogResponse } from '../dto/responses/access-log.response.dto';
import { CheckAccessResponse } from '../dto/responses/check-access.response.dto';
import { AccessLogMapper } from '../mappers/access-log.mapper';
import { CheckAccessMapper } from '../mappers/check-access.mapper';
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

  @ApiOperation({ summary: 'Crea un nuevo registro de acceso manualmente' })
  @ApiBody({ type: CreateAccessLogRequest })
  @ApiCreatedResponse({ description: 'Registro de acceso creado con éxito', type: AccessLogResponse })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('logs')
  async create(@Body() requestDto: CreateAccessLogRequest): Promise<AccessLogResponse> {
    const accessLog = await this.accessService.create(requestDto);
    return AccessLogMapper.toResponse(accessLog);
  }

  @ApiOperation({
    summary: 'Valida el acceso de un usuario a un aula',
    description: 'Endpoint para lectores RFID/NFC. Valida permisos y registra el intento'
  })
  @ApiBody({ type: CheckAccessRequest })
  @ApiOkResponse({ description: 'Validación de acceso completada', type: CheckAccessResponse })
  @ApiBadRequestResponse({ description: 'Datos inválidos o falta rawUid/tagCode según el método' })
  @Post('check')
  async checkAccess(@Body() requestDto: CheckAccessRequest, @CurrentUser() currentUser: any): Promise<CheckAccessResponse> {
    const [permission, accessStatus, reasonStatus] = await this.accessService.checkAccess(requestDto, currentUser);
    return CheckAccessMapper.toResponse(permission, accessStatus, reasonStatus);
  }
}
