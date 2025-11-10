import { ApiProperty } from '@nestjs/swagger';
import { EventScheduleType } from 'src/schedules/domain/enums/event-schedule-type.enum';
import { EventStatus } from 'src/schedules/domain/enums/event-status.enum';

export class EventScheduleResponse {
  @ApiProperty({ description: 'Tipo de evento', enum: EventScheduleType, example: EventScheduleType.RESERVATION })
  eventType: EventScheduleType;

  @ApiProperty({ description: 'Fecha y hora de inicio del evento', example: '2024-09-01T08:00:00.000Z' })
  startAt: Date;

  @ApiProperty({ description: 'Fecha y hora de fin del evento', example: '2024-09-01T10:00:00.000Z' })
  endAt: Date;

  @ApiProperty({ description: 'Estado del evento', enum: EventStatus, example: EventStatus.PENDING })
  status: EventStatus;

  @ApiProperty({ description: 'Motivo del evento', example: 'Reunión de departamento' })
  reason: string;
}
