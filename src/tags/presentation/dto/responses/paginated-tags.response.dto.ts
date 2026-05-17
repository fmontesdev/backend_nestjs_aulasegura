import { ApiProperty } from '@nestjs/swagger';
import { TagResponse } from './tag.response.dto';

export class PaginationMeta {
  @ApiProperty({ description: 'Total de credenciales encontradas' })
  total!: number;

  @ApiProperty({ description: 'Página actual' })
  page!: number;

  @ApiProperty({ description: 'Límite de credenciales por página' })
  limit!: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages!: number;

  @ApiProperty({ description: 'Hay página anterior' })
  hasPrevious!: boolean;

  @ApiProperty({ description: 'Hay página siguiente' })
  hasNext!: boolean;
}

export class PaginatedTagsResponse {
  @ApiProperty({ type: [TagResponse], description: 'Lista de credenciales' })
  data!: TagResponse[];

  @ApiProperty({ type: PaginationMeta, description: 'Metadata de paginación' })
  meta!: PaginationMeta;
}
