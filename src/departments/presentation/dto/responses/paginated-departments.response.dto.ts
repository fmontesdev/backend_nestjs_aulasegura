import { ApiProperty } from '@nestjs/swagger';
import { DepartmentResponse } from './department.response.dto';

export class PaginationMeta {
  @ApiProperty({ description: 'Total de departamentos encontrados' })
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

export class PaginatedDepartmentsResponse {
  @ApiProperty({ type: [DepartmentResponse], description: 'Lista de departamentos' })
  data!: DepartmentResponse[];

  @ApiProperty({ type: PaginationMeta, description: 'Metadata de paginación' })
  meta!: PaginationMeta;
}
