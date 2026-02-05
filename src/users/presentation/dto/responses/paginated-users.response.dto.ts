import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response.dto';

export class PaginationMeta {
  @ApiProperty({ description: 'Total de usuarios encontrados' })
  total!: number;

  @ApiProperty({ description: 'Página actual' })
  page!: number;

  @ApiProperty({ description: 'Límite de items por página' })
  limit!: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages!: number;

  @ApiProperty({ description: 'Hay página anterior' })
  hasPrevious!: boolean;

  @ApiProperty({ description: 'Hay página siguiente' })
  hasNext!: boolean;
}

export class PaginatedUsersResponse {
  @ApiProperty({ type: [UserResponse], description: 'Lista de usuarios' })
  data!: UserResponse[];

  @ApiProperty({ type: PaginationMeta, description: 'Metadata de paginación' })
  meta!: PaginationMeta;
}
