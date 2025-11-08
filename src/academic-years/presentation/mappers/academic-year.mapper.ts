import { AcademicYearEntity } from '../../domain/entities/academic-year.entity';
import { AcademicYearResponse } from '../dto/responses/academic-year.response.dto';

export class AcademicYearMapper {
  static toResponse(entity: AcademicYearEntity): AcademicYearResponse {
    return {
      academicYearId: entity.academicYearId,
      code: entity.code,
      isActive: entity.isActive,
    };
  }

  static toResponseList(entities: AcademicYearEntity[]): AcademicYearResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
