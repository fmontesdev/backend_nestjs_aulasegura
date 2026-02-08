import { ApiProperty } from '@nestjs/swagger';
import { SubjectResponse } from './subject.response.dto';

export class PaginationMeta {
  @ApiProperty({ description: 'Total de asignaturas encontradas' })
  total!: number;

  @ApiProperty({ description: 'Página actual' })
  page!: number;

  @ApiProperty({ description: 'Límite de asignaturas por página' })
  limit!: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages!: number;

  @ApiProperty({ description: 'Hay página anterior' })
  hasPrevious!: boolean;

  @ApiProperty({ description: 'Hay página siguiente' })
  hasNext!: boolean;
}

export class PaginatedSubjectsResponse {
  @ApiProperty({ type: [SubjectResponse], description: 'Lista de asignaturas' })
  data!: SubjectResponse[];

  @ApiProperty({ type: PaginationMeta, description: 'Metadata de paginación' })
  meta!: PaginationMeta;
}