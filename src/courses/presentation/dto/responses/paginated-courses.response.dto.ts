import { ApiProperty } from '@nestjs/swagger';
import { CourseResponse } from './course.response.dto';

export class PaginationMeta {
  @ApiProperty({ description: 'Total de cursos encontrados' })
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

export class PaginatedCoursesResponse {
  @ApiProperty({ type: [CourseResponse], description: 'Lista de cursos' })
  data!: CourseResponse[];

  @ApiProperty({ type: PaginationMeta, description: 'Metadata de paginación' })
  meta!: PaginationMeta;
}
