import { ApiProperty } from '@nestjs/swagger';

export class AcademicYearResponse {
  @ApiProperty({ description: 'Identificador único del año académico', example: 1 })
  academicYearId: number;

  @ApiProperty({ description: 'Código del año académico en formato YYYY-YYYY', example: '2024-2025' })
  code: string;

  @ApiProperty({ description: 'Estado del año académico (eliminación lógica)', example: true })
  isActive: boolean;
}
