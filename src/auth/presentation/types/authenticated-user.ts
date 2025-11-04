import { RoleName } from 'src/users/domain/enums/rolename.enum';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  roles: RoleName[];
}
