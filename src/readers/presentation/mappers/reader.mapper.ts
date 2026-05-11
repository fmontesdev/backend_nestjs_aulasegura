import { ReaderEntity } from '../../domain/entities/reader.entity';
import { ReaderResponse } from '../dto/responses/reader.response.dto';
import { PaginatedReadersResponse, PaginationMeta } from '../dto/responses/paginated-readers.response.dto';
import { PaginatedResult } from '../../application/dto/find-readers-filters.dto';

export class ReaderMapper {
  /// Convierte una entidad Reader a ReaderResponse
  static toResponse(reader: ReaderEntity): ReaderResponse {
    return {
      readerId: reader.readerId,
      readerCode: reader.readerCode,
      roomId: reader.roomId,
      roomCode: reader.room?.roomCode,
      roomName: reader.room?.name,
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

  static toPaginationMeta(result: PaginatedResult<ReaderEntity>): PaginationMeta {
    return {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasPrevious: result.page > 1,
      hasNext: result.page < result.totalPages,
    };
  }

  static toPaginatedResponse(result: PaginatedResult<ReaderEntity>): PaginatedReadersResponse {
    return {
      data: this.toResponseList(result.data),
      meta: this.toPaginationMeta(result),
    };
  }
}
