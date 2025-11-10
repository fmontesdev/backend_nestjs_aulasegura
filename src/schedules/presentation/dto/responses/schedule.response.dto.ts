import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ScheduleType } from 'src/schedules/domain/enums/schedule-type.enum';
import { AcademicYearResponse } from 'src/academic-years/presentation/dto/responses/academic-year.response.dto';
import { WeeklyScheduleResponse } from './weekly-schedule.response.dto';
import { EventScheduleResponse } from './event-schedule.response.dto';

export class ScheduleResponse {
  @ApiProperty({ description: 'ID del horario', example: 1 })
  scheduleId: number;

  @ApiProperty({ description: 'Tipo de horario', enum: ScheduleType, example: ScheduleType.WEEKLY })
  type: ScheduleType;

  @ApiProperty({ description: 'Año académico', type: () => AcademicYearResponse })
  academicYear: AcademicYearResponse;

  @ApiProperty({ description: 'Estado activo del horario', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Fecha de creación', example: '2024-09-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Fecha de última actualización', example: '2024-09-01T10:00:00.000Z', nullable: true })
  updatedAt: Date | null;

  @ApiPropertyOptional({ description: 'Horario semanal asociado', type: () => WeeklyScheduleResponse, nullable: true })
  weeklySchedule?: WeeklyScheduleResponse;
  
  @ApiPropertyOptional({ description: 'Evento de horario asociado', type: () => EventScheduleResponse, nullable: true })
  eventSchedule?: EventScheduleResponse;
}
