import { ApiProperty } from '@nestjs/swagger';
import { RoomResponse } from './room.response.dto';

export class PaginationMeta {
  @ApiProperty({ description: 'Total de aulas encontradas' })
  total!: number;

  @ApiProperty({ description: 'Página actual' })
  page!: number;

  @ApiProperty({ description: 'Límite de aulas por página' })
  limit!: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages!: number;

  @ApiProperty({ description: 'Hay página anterior' })
  hasPrevious!: boolean;

  @ApiProperty({ description: 'Hay página siguiente' })
  hasNext!: boolean;
}

export class PaginatedRoomsResponse {
  @ApiProperty({ type: [RoomResponse], description: 'Lista de aulas' })
  data!: RoomResponse[];

  @ApiProperty({ type: PaginationMeta, description: 'Metadata de paginación' })
  meta!: PaginationMeta;
}
