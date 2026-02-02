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
      roles: user.roles?.map(role => role.name) ?? [],
      validFrom: user.validFrom,
      validTo: user.validTo ?? null,
      createdAt: user.createdAt,
      department: user.teacher?.department ?? null,
    };
  }

  static toResponseList(entities: UserEntity[]): UserResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
