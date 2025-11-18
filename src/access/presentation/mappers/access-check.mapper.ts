import { PermissionEntity } from 'src/permissions/domain/entities/permission.entity';
import { AccessCheckResponse } from '../dto/responses/access-check.response.dto';
import { PermissionMapper } from '../../../permissions/presentation/mappers/permission.mapper';
import { AccessStatus } from '../../domain/enums/access-status.enum';

export class AccessCheckMapper {
  static toResponse(permission: PermissionEntity | null, accessStatus: AccessStatus, reasonStatus: string): AccessCheckResponse {
    return {
      permission: permission != null ? PermissionMapper.toResponse(permission) : null,
      accessStatus: accessStatus,
      reasonStatus: reasonStatus,
    };
  }

  static toResponseList(permission: PermissionEntity | null, accessStatus: AccessStatus, reasonStatus: string): AccessCheckResponse[] {
    return [this.toResponse(permission, accessStatus, reasonStatus)];
  }
}
