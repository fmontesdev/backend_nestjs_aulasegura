import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class UpdateWeeklyScheduleRequest {
  @ApiPropertyOptional({ description: 'Fecha de inicio de validez (YYYY-MM-DD)', example: '2024-09-01' })
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin de validez (YYYY-MM-DD)', example: '2025-06-30', nullable: true })
  @IsOptional()
  @IsDateString()
  validTo?: string | null;
}
