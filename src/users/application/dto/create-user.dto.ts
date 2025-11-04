import { RoleName } from '../../domain/enums/rolename.enum';

export interface CreateUserDto {
  name: string;
  lastname: string;
  email: string;
  password: string;
  roleName: RoleName;
  avatar?: string | null;
  // validTo?: Date | null;
  departmentId?: number;
}
