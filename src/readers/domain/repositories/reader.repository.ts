import { ReaderEntity } from '../entities/reader.entity';

export abstract class ReaderRepository {
  abstract findAll(): Promise<ReaderEntity[]>;
  abstract findOneById(readerId: number): Promise<ReaderEntity | null>;
  abstract findOneActiveById(readerId: number): Promise<ReaderEntity | null>;
  abstract findOneByReaderCode(readerCode: string): Promise<ReaderEntity | null>;
  abstract save(reader: ReaderEntity): Promise<ReaderEntity>;
}
