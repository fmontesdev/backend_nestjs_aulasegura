import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ScheduleType } from 'src/schedules/domain/enums/schedule-type.enum';
import { AcademicYearResponse } from 'src/academic-years/presentation/dto/responses/academic-year.response.dto';

export class WeeklyScheduleResponse {
  @ApiProperty({ description: 'ID del horario', example: 1 })
  scheduleId: number;

  @ApiProperty({ description: 'Tipo de horario', enum: ScheduleType, example: ScheduleType.WEEKLY })
  type: ScheduleType;

  @ApiProperty({ description: 'Año académico', type: () => AcademicYearResponse })
  academicYear: AcademicYearResponse;

  @ApiProperty({ description: 'Día de la semana (1=Lunes, 7=Domingo)', example: 1 })
  dayOfWeek: number;

  @ApiProperty({ description: 'Hora de inicio (HH:MM:SS)', example: '08:00:00' })
  startTime: string;

  @ApiProperty({ description: 'Hora de fin (HH:MM:SS)', example: '09:00:00' })
  endTime: string;

  @ApiProperty({ description: 'Fecha de inicio de validez (YYYY-MM-DD)', example: '2024-09-01' })
  validFrom: string;

  @ApiPropertyOptional({ description: 'Fecha de fin de validez (YYYY-MM-DD)', example: '2025-06-30', nullable: true })
  validTo: string | null;

  @ApiProperty({ description: 'Estado activo del horario', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Fecha de creación', example: '2024-09-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Fecha de última actualización', example: '2024-09-01T10:00:00.000Z', nullable: true })
  updatedAt: Date | null;
}
