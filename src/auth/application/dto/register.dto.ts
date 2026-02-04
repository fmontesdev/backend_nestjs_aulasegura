import { RoleName } from '../../../users/domain/enums/rolename.enum';

export interface RegisterDto {
  name: string;
  lastname: string;
  email: string;
  password: string;
  roles: RoleName[];
  avatar?: string;
  departmentId?: number;
  validTo?: Date | null;
}
