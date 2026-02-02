import { RoleName } from '../../domain/enums/rolename.enum';

export interface UpdateUserDto {
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  avatar?: string | null;
  roles?: RoleName[];
  validTo?: Date | null;
  departmentId?: number;
}
