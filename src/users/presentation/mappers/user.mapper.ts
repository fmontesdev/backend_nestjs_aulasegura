import { UserEntity } from '../../domain/entities/user.entity';
import { UserResponse } from '../dto/responses/user.response.dto';

export class UserMapper {
  static toResponse(e: UserEntity): UserResponse {
    return {
      userId: e.userId,
      name: e.name,
      lastname: e.lastname,
      email: e.email,
      avatar: e.avatar ?? null,
      validFrom: e.validFrom,
      validTo: e.validTo ?? null,
      createdAt: e.createdAt,
    };
  }

  static toResponseList(list: UserEntity[]): UserResponse[] {
    return list.map(UserMapper.toResponse);
  }
}
