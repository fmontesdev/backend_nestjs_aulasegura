import { EventScheduleEntity } from '../../domain/entities/event-schedule.entity';
import { EventScheduleResponse } from '../dto/responses/event-schedule.response.dto';

export class EventScheduleMapper {
  /// Convierte una entidad EventSchedule a EventScheduleResponse
  static toResponse(entity: EventScheduleEntity): EventScheduleResponse {
    return {
      eventType: entity.type,
      description: entity.description,
      startAt: entity.startAt,
      endAt: entity.endAt,
      status: entity.status,
      reservationStatusReason: entity.reservationStatusReason,
    };
  }

  /// Convierte una lista de entidades EventSchedule a lista de EventScheduleResponse
  static toResponseList(entities: EventScheduleEntity[]): EventScheduleResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
