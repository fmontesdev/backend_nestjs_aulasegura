import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ReaderEntity } from '../../domain/entities/reader.entity';
import { ReaderRepository } from '../../domain/repositories/reader.repository';
import { CreateReaderDto } from '../dto/create-reader.dto';
import { UpdateReaderDto } from '../dto/update-reader.dto';
import { RoomService } from '../../../rooms/application/services/room.service';
import { RoomEntity } from '../../../rooms/domain/entities/room.entity';

@Injectable()
export class ReaderService {
  constructor(
    private readonly readerRepository: ReaderRepository,
    private readonly roomService: RoomService,
  ) {}

  /// Busca todos los lectores activos
  async findAll(): Promise<ReaderEntity[]> {
    return await this.readerRepository.findAll();
  }

  /// Busca un lector por readerId o lanza una excepción si no se encuentra
  async findOne(readerId: number): Promise<ReaderEntity> {
    return await this.findReaderByIdOrFail(readerId);
  }

  /// Busca un lector por readerCode o lanza una excepción si no se encuentra
  async findOneByReaderCode(readerCode: string): Promise<ReaderEntity> {
    return await this.findReaderByCodeOrFail(readerCode);
  }

  /// Crea un nuevo lector
  async create(createDto: CreateReaderDto): Promise<ReaderEntity> {
    // Verifica que el código del lector sea único
    await this.ensureReaderCodeIsUnique(createDto.readerCode);

    // Verifica que el aula exista
    const room: RoomEntity = await this.roomService.findOne(createDto.roomId);

    // Crea el nuevo lector
    const reader = new ReaderEntity();
    reader.readerCode = createDto.readerCode;
    reader.room = room;

    // Guarda en la base de datos
    try {
      return await this.readerRepository.save(reader);
    } catch (error) {
      throw new ConflictException(`Reader with code ${createDto.readerCode} could not be created`);
    }
  }

  /// Actualiza un lector existente
  async update(readerId: number, updateDto: UpdateReaderDto): Promise<ReaderEntity> {
    // Busca el lector a actualizar
    const reader = await this.findReaderByIdOrFail(readerId);

    // Si se quiere cambiar el código, verifica unicidad
    if (updateDto.readerCode && updateDto.readerCode !== reader.readerCode) {
      await this.ensureReaderCodeIsUnique(updateDto.readerCode);
      reader.readerCode = updateDto.readerCode;
    }

    // Si se quiere cambiar el roomId, verifica que el aula exista
    if (updateDto.roomId !== undefined) {
      const room: RoomEntity = await this.roomService.findOne(updateDto.roomId);
      reader.room = room;
    }

    try {
      return await this.readerRepository.save(reader);
    } catch (error) {
      throw new ConflictException(`Reader with ID ${readerId} could not be updated`);
    }
  }

  /// Desactiva un lector (soft delete)
  async softRemove(readerId: number): Promise<void> {
    // Buscar el lector a eliminar
    const reader = await this.findActiveReaderByIdOrFail(readerId);
    reader.isActive = false;
    await this.readerRepository.save(reader);
  }

  //? ================= Métodos auxiliares =================

  //? Busca un lector por readerId o lanza una excepción si no se encuentra
  private async findReaderByIdOrFail(readerId: number): Promise<ReaderEntity> {
    const reader = await this.readerRepository.findOneById(readerId);
    if (!reader) {
      throw new NotFoundException(`Reader with ID ${readerId} not found`);
    }
    return reader;
  }

  //? Buscar un lector por readerCode o lanza una excepción si no se encuentra
  private async findReaderByCodeOrFail(readerCode: string): Promise<ReaderEntity> {
    const reader = await this.readerRepository.findOneByReaderCode(readerCode);
    if (!reader) {
      throw new NotFoundException(`Reader with code ${readerCode} not found`);
    }
    return reader;
  }

  //? Busca un lector activo por readerId o lanza una excepción si no se encuentra
  private async findActiveReaderByIdOrFail(readerId: number): Promise<ReaderEntity> {
    const reader = await this.readerRepository.findOneActiveById(readerId);
    if (!reader) {
      throw new NotFoundException(`Active reader with ID ${readerId} not found`);
    }
    return reader;
  }

  //? Verifica que el código del lector sea único
  private async ensureReaderCodeIsUnique(readerCode: string): Promise<void> {
    const existing = await this.readerRepository.findOneByReaderCode(readerCode);
    if (existing) {
      throw new ConflictException(`Reader with code ${readerCode} already exists`);
    }
  }
}
