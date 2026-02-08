import { SubjectEntity } from '../entities/subject.entity';
import { FindSubjectsFiltersDto } from '../../application/dto/find-subjects-filters.dto';

export abstract class SubjectRepository {
  abstract findAllWithFilters(filters: FindSubjectsFiltersDto): Promise<{ data: SubjectEntity[]; total: number }>;
  abstract findOneById(subjectId: number): Promise<SubjectEntity | null>;
  abstract findOneActiveById(subjectId: number): Promise<SubjectEntity | null>;
  abstract findOneBySubjectCode(subjectCode: string): Promise<SubjectEntity | null>;
  abstract save(subject: SubjectEntity): Promise<SubjectEntity>;
}
