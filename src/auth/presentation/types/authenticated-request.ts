import { Request } from 'express';
import { UserEntity } from 'src/users/domain/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user: UserEntity;
}
