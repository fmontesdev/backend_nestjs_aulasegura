import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponse } from 'src/permissions/presentation/dto/responses/permission.response.dto';
import { AccessStatus } from '../../../domain/enums/access-status.enum';

export class AccessCheckResponse {
  @ApiProperty({ description: 'Permiso asociado al acceso', type: () => PermissionResponse, nullable: true })
  permission: PermissionResponse | null;

  @ApiProperty({ description: 'Estado del acceso', enum: AccessStatus, example: AccessStatus.ALLOWED })
  accessStatus: AccessStatus;

  @ApiProperty({ description: 'Razón del estado (opcional)', example: 'Permiso válido encontrado', nullable: true })
  reasonStatus: string | null;
}
