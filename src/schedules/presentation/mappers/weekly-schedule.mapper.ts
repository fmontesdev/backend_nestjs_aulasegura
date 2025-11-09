import { WeeklyScheduleEntity } from '../../domain/entities/weekly-schedule.entity';
import { WeeklyScheduleResponse } from '../dto/responses/weekly-schedule.response.dto';
import { AcademicYearMapper } from '../../../academic-years/presentation/mappers/academic-year.mapper';

export class WeeklyScheduleMapper {
  /// Convierte una entidad WeeklySchedule a WeeklyScheduleResponse
  static toResponse(entity: WeeklyScheduleEntity): WeeklyScheduleResponse {
    return {
      scheduleId: entity.scheduleId,
      type: entity.schedule.type,
      academicYear: entity.schedule.academicYear ?? AcademicYearMapper.toResponse(entity.schedule.academicYear),
      dayOfWeek: entity.dayOfWeek,
      startTime: entity.startTime,
      endTime: entity.endTime,
      validFrom: entity.validFrom,
      validTo: entity.validTo,
      isActive: entity.schedule.isActive,
      createdAt: entity.schedule.createdAt,
      updatedAt: entity.schedule.updatedAt,
    };
  }

  /// Convierte una lista de entidades WeeklySchedule a lista de WeeklyScheduleResponse
  static toResponseList(entities: WeeklyScheduleEntity[]): WeeklyScheduleResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
