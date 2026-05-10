import { ApiProperty } from '@nestjs/swagger';
import { EventScheduleType } from 'src/schedules/domain/enums/event-schedule-type.enum';
import { EventStatus } from 'src/schedules/domain/enums/event-status.enum';

export class EventScheduleResponse {
  @ApiProperty({ description: 'Tipo de evento', enum: EventScheduleType, example: EventScheduleType.RESERVATION })
  eventType: EventScheduleType;

  @ApiProperty({ description: 'Descripción del evento', example: 'Exámen primera evaluación de base de datos' })
  description: string;

  @ApiProperty({ description: 'Fecha y hora de inicio del evento en Europe/Madrid', example: '2024-09-01T08:00:00.000+02:00' })
  startAt: string;

  @ApiProperty({ description: 'Fecha y hora de fin del evento en Europe/Madrid', example: '2024-09-01T10:00:00.000+02:00' })
  endAt: string;

  @ApiProperty({ description: 'Estado del evento', enum: EventStatus, example: EventStatus.PENDING })
  status: EventStatus;

  @ApiProperty({
    description: 'Motivo del estado de la reserva del aula',
    example: 'Reserva denegada por falta de disponibilidad',
    default: null,
  })
  reservationStatusReason: string;
}
