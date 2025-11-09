import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, Min, Max, IsString, Matches, IsDateString, IsOptional } from 'class-validator';

export class CreateWeeklyScheduleRequest {
  @ApiProperty({ description: 'Día de la semana (1=Lunes, 7=Domingo)', example: 1, minimum: 1, maximum: 7 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek: number;

  @ApiProperty({ description: 'Hora de inicio (HH:MM:SS)', example: '08:00:00' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'startTime debe tener formato HH:MM:SS',
  })
  startTime: string;

  @ApiProperty({ description: 'Hora de fin (HH:MM:SS)', example: '09:00:00' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'endTime debe tener formato HH:MM:SS',
  })
  endTime: string;

  @ApiProperty({ description: 'Fecha de inicio de validez (YYYY-MM-DD)', example: '2024-09-01' })
  @IsNotEmpty()
  @IsDateString()
  validFrom: string;

  @ApiPropertyOptional({ description: 'Fecha de fin de validez (YYYY-MM-DD)', example: '2025-06-30', nullable: true })
  @IsOptional()
  @IsDateString()
  validTo?: string | null;
}
