import { ScheduleEntity } from '../../domain/entities/schedule.entity';
import { ScheduleType } from '../../domain/enums/schedule-type.enum';
import { ScheduleResponse } from '../dto/responses/schedule.response.dto';
import { WeeklyScheduleMapper } from './weekly-schedule.mapper';
import { EventScheduleMapper } from './event-schedule.mapper';
import { AcademicYearMapper } from '../../../academic-years/presentation/mappers/academic-year.mapper';

export class ScheduleMapper {
  /// Convierte una entidad Schedule a ScheduleResponse (Weekly o Event)
  static toResponse(entity: ScheduleEntity): ScheduleResponse {
    return {
      scheduleId: entity.scheduleId,
      type: entity.type,
      academicYear: AcademicYearMapper.toResponse(entity.academicYear),
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      weeklySchedule: entity.type === ScheduleType.WEEKLY ? WeeklyScheduleMapper.toResponse(entity.weeklySchedule!) : undefined,
      eventSchedule: entity.type === ScheduleType.EVENT ? EventScheduleMapper.toResponse(entity.eventSchedule!) : undefined,
    };
  }

  /// Convierte una lista de entidades Schedule a lista de ScheduleResponse
  static toResponseList(entities: ScheduleEntity[]): ScheduleResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
