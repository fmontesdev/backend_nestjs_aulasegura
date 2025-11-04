import { UserEntity } from '../../domain/entities/user.entity';
import { UserResponse } from '../dto/responses/user.response.dto';

export class UserMapper {
  static toResponse(user: UserEntity): UserResponse {
    return {
      userId: user.userId,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      avatar: user.avatar ?? null,
      validFrom: user.validFrom,
      validTo: user.validTo ?? null,
      createdAt: user.createdAt,
    };
  }

  static toResponseList(list: UserEntity[]): UserResponse[] {
    return list.map(UserMapper.toResponse);
  }
}
