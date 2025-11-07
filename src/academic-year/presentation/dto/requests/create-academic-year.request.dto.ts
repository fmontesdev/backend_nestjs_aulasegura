import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, IsNotEmpty } from 'class-validator';

export class CreateAcademicYearRequest {
  @ApiProperty({ description: 'Código del año académico en formato YYYY-YYYY', example: '2024-2025', pattern: '^\\d{4}-\\d{4}$' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{4}$/, { message: 'The code must have the format YYYY-YYYY (e.g., 2024-2025)' })
  code!: string;
}
