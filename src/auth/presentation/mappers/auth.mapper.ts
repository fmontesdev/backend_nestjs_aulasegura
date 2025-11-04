import { UserEntity } from '../../../users/domain/entities/user.entity';
import { AuthResponse } from '../dto/responses/auth.response.dto';

export class AuthMapper {
  static toAuthResponse( user: UserEntity, tokens: { accessToken: string; refreshToken: string } ): AuthResponse {
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.userId,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      avatar: user.avatar ?? null,
      roles: user.roles?.map((role) => role.name) ?? [],
      department: user.teacher?.department ?? null,
    };
  }

  static toAuthResponseWithoutTokens(user: UserEntity): AuthResponse {
    return {
      userId: user.userId,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      avatar: user.avatar ?? null,
      roles: user.roles?.map((role) => role.name) ?? [],
      department: user.teacher?.department ?? null,
    };
  }
}
