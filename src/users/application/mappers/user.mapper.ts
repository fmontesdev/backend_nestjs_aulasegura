import { UserEntity } from '../../domain/entities/user.entity';
import { UserOutput } from '../dto/outputs/user.output';

export class UserMapper {
  static toResponse(e: UserEntity): UserOutput {
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

  static toResponseList(list: UserEntity[]): UserOutput[] {
    return list.map(UserMapper.toResponse);
  }
}
