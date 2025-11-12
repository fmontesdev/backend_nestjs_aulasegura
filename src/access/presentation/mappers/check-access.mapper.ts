import { PermissionEntity } from 'src/permissions/domain/entities/permission.entity';
import { CheckAccessResponse } from '../dto/responses/check-access.response.dto';
import { PermissionMapper } from '../../../permissions/presentation/mappers/permission.mapper';
import { AccessStatus } from '../../domain/enums/access-status.enum';

export class CheckAccessMapper {
  static toResponse(permission: PermissionEntity | null, accessStatus: AccessStatus, reasonStatus: string): CheckAccessResponse {
    return {
      permission: permission != null ? PermissionMapper.toResponse(permission) : null,
      accessStatus: accessStatus,
      reasonStatus: reasonStatus,
    };
  }

  static toResponseList(permission: PermissionEntity | null, accessStatus: AccessStatus, reasonStatus: string): CheckAccessResponse[] {
    return [this.toResponse(permission, accessStatus, reasonStatus)];
  }
}
