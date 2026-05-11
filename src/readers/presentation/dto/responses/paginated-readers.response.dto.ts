import { ApiProperty } from '@nestjs/swagger';
import { ReaderResponse } from './reader.response.dto';

export class PaginationMeta {
  @ApiProperty({ description: 'Total de lectores encontrados' })
  total!: number;

  @ApiProperty({ description: 'Página actual' })
  page!: number;

  @ApiProperty({ description: 'Límite de lectores por página' })
  limit!: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages!: number;

  @ApiProperty({ description: 'Hay página anterior' })
  hasPrevious!: boolean;

  @ApiProperty({ description: 'Hay página siguiente' })
  hasNext!: boolean;
}

export class PaginatedReadersResponse {
  @ApiProperty({ type: [ReaderResponse], description: 'Lista de lectores' })
  data!: ReaderResponse[];

  @ApiProperty({ type: PaginationMeta, description: 'Metadata de paginación' })
  meta!: PaginationMeta;
}
