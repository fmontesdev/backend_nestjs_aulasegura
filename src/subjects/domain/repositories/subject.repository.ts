import { SubjectEntity } from '../entities/subject.entity';

export abstract class SubjectRepository {
  abstract findAll(): Promise<SubjectEntity[]>;
  abstract findOneById(subjectId: number): Promise<SubjectEntity | null>;
  abstract findOneActiveById(subjectId: number): Promise<SubjectEntity | null>;
  abstract findOneBySubjectCode(subjectCode: string): Promise<SubjectEntity | null>;
  abstract save(subject: SubjectEntity): Promise<SubjectEntity>;
}
