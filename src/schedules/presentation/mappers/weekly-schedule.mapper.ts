import { WeeklyScheduleEntity } from '../../domain/entities/weekly-schedule.entity';
import { WeeklyScheduleResponse } from '../dto/responses/weekly-schedule.response.dto';

export class WeeklyScheduleMapper {
  /// Convierte una entidad WeeklySchedule a WeeklyScheduleResponse
  static toResponse(entity: WeeklyScheduleEntity): WeeklyScheduleResponse {
    return {
      dayOfWeek: entity.dayOfWeek,
      startTime: entity.startTime,
      endTime: entity.endTime
    };
  }

  /// Convierte una lista de entidades WeeklySchedule a lista de WeeklyScheduleResponse
  static toResponseList(entities: WeeklyScheduleEntity[]): WeeklyScheduleResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
