import { ApiProperty } from '@nestjs/swagger';
import { AccessLogResponse } from './access-log.response.dto';

export class PaginationMeta {
  @ApiProperty({ description: 'Total de registros de acceso encontrados' })
  total!: number;

  @ApiProperty({ description: 'Página actual' })
  page!: number;

  @ApiProperty({ description: 'Límite de registros por página' })
  limit!: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages!: number;

  @ApiProperty({ description: 'Hay página anterior' })
  hasPrevious!: boolean;

  @ApiProperty({ description: 'Hay página siguiente' })
  hasNext!: boolean;
}

export class PaginatedAccessLogsResponse {
  @ApiProperty({ type: [AccessLogResponse], description: 'Lista de registros de acceso' })
  data!: AccessLogResponse[];

  @ApiProperty({ type: PaginationMeta, description: 'Metadata de paginación' })
  meta!: PaginationMeta;
}
