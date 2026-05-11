import { ReaderEntity } from '../entities/reader.entity';
import { FindReadersFiltersDto, PaginatedResult } from '../../application/dto/find-readers-filters.dto';

export abstract class ReaderRepository {
  abstract findAll(): Promise<ReaderEntity[]>;
  abstract findAllWithFilters(filters: FindReadersFiltersDto): Promise<PaginatedResult<ReaderEntity>>;
  abstract findOneById(readerId: number): Promise<ReaderEntity | null>;
  abstract findOneActiveById(readerId: number): Promise<ReaderEntity | null>;
  abstract findOneByReaderCode(readerCode: string): Promise<ReaderEntity | null>;
  abstract save(reader: ReaderEntity): Promise<ReaderEntity>;
}
