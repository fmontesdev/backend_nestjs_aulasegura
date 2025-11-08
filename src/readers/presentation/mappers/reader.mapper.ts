import { ReaderEntity } from '../../domain/entities/reader.entity';
import { ReaderResponse } from '../dto/responses/reader.response.dto';

export class ReaderMapper {
  /// Convierte una entidad Reader a ReaderResponse
  static toResponse(reader: ReaderEntity): ReaderResponse {
    return {
      readerId: reader.readerId,
      readerCode: reader.readerCode,
      roomId: reader.roomId,
      isActive: reader.isActive,
    };
  }

  /// Convierte una lista de entidades Reader a lista de ReaderResponse
  static toResponseList(readers: ReaderEntity[]): ReaderResponse[] {
    return readers.map((reader) => this.toResponse(reader));
  }

  // Convierte una entidad Reader a ReaderResponse simple (sin roomId)

  static toSimpleResponse(reader: ReaderEntity): ReaderResponse {
    return {
      readerId: reader.readerId,
      readerCode: reader.readerCode,
      isActive: reader.isActive,
    };
  }

  static toSimpleResponseList(readers: ReaderEntity[]): ReaderResponse[] {
    return readers.map((reader) => this.toSimpleResponse(reader));
  }
}
