import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsString, Matches, IsDateString } from 'class-validator';

export class UpdateWeeklyScheduleRequest {
  @ApiPropertyOptional({ description: 'Día de la semana (1=Lunes, 7=Domingo)', example: 1, minimum: 1, maximum: 7 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek?: number;

  @ApiPropertyOptional({ description: 'Hora de inicio (HH:MM:SS)', example: '08:00:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'startTime debe tener formato HH:MM:SS',
  })
  startTime?: string;

  @ApiPropertyOptional({ description: 'Hora de fin (HH:MM:SS)', example: '09:00:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'endTime debe tener formato HH:MM:SS',
  })
  endTime?: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio de validez (YYYY-MM-DD)', example: '2024-09-01' })
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin de validez (YYYY-MM-DD)', example: '2025-06-30', nullable: true })
  @IsOptional()
  @IsDateString()
  validTo?: string | null;
}
