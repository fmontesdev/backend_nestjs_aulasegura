import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { EventStatus } from 'src/schedules/domain/enums/event-status.enum';

export class UpdateWeeklyScheduleRequest {
  @ApiPropertyOptional({ description: 'Descripción del evento', example: 'Examen de evaluación de matemáticas' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;

  @ApiPropertyOptional({ description: 'Estado del evento de horario', enum: EventStatus, example: Object.values(EventStatus)[0] })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiPropertyOptional({ description: 'Motivo del estado de la reserva', example: 'Reserva cancelada por falta de disponibilidad de aulas' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  reservationStatusReason?: string;
}
