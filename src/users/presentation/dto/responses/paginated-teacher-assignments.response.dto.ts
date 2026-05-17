import { ApiProperty } from '@nestjs/swagger';
import { TeacherAssignmentResponse } from './teacher-assignment.response.dto';

export class TeacherAssignmentsPaginationMeta {
  @ApiProperty({ description: 'Página actual' })
  page!: number;

  @ApiProperty({ description: 'Límite de asignaciones por página' })
  limit!: number;

  @ApiProperty({ description: 'Total de asignaciones encontradas' })
  total!: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages!: number;
}

export class PaginatedTeacherAssignmentsResponse {
  @ApiProperty({ type: [TeacherAssignmentResponse], description: 'Lista de asignaciones profesor-curso-asignatura' })
  data!: TeacherAssignmentResponse[];

  @ApiProperty({ type: TeacherAssignmentsPaginationMeta, description: 'Metadata de paginación' })
  meta!: TeacherAssignmentsPaginationMeta;
}
