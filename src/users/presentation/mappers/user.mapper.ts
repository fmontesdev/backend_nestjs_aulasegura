import { UserEntity } from '../../domain/entities/user.entity';
import { UserResponse } from '../dto/responses/user.response.dto';
import { PaginatedUsersResponse, PaginationMeta } from '../dto/responses/paginated-users.response.dto';
import { PaginatedResult } from '../../application/dto/find-users-filters.dto';

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

  static toPaginationMeta(result: PaginatedResult<UserEntity>): PaginationMeta {
    return {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasPrevious: result.page > 1,
      hasNext: result.page < result.totalPages,
    };
  }

  static toPaginatedResponse(result: PaginatedResult<UserEntity>): PaginatedUsersResponse {
    return {
      data: this.toResponseList(result.data),
      meta: this.toPaginationMeta(result),
    };
  }
}
