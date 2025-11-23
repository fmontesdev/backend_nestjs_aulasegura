import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { RoomEntity } from '../../domain/entities/room.entity';
import { RoomRepository } from '../../domain/repositories/room.repository';
import { CreateRoomDto } from '../dto/create-room.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { FindAvailableRoomsDto } from '../dto/find-available-rooms.dto';
import { CourseService } from '../../../courses/application/services/course.service';
import { PermissionService } from '../../../permissions/application/services/permission.service';
import { CourseEntity } from '../../../courses/domain/entities/course.entity';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly courseService: CourseService,
    private readonly permissionService: PermissionService,
  ) {}

  /// Busca todas las aulas activas
  async findAll(): Promise<RoomEntity[]> {
    return await this.roomRepository.findAll();
  }

  /// Busca un aula por roomId o lanza una excepción si no se encuentra
  async findOne(roomId: number): Promise<RoomEntity> {
    return await this.findRoomByIdOrFail(roomId);
  }

  /// Crea una nueva aula
  async create(createDto: CreateRoomDto): Promise<RoomEntity> {
    // Verificar que el código del aula sea único
    await this.ensureRoomCodeIsUnique(createDto.roomCode);

    // Si se proporciona courseId, verificar que el curso exista
    let course: CourseEntity | null = null;
    if (createDto.courseId) {
      course = await this.courseService.findOne(createDto.courseId);
    }

    // Crear la nueva aula
    const room = new RoomEntity();
    room.roomCode = createDto.roomCode;
    room.name = createDto.name;
    room.course = createDto.courseId ? course : null;
    room.capacity = createDto.capacity;
    room.building = createDto.building;
    room.floor = createDto.floor;

    // Guardar en la base de datos
    try {
      return await this.roomRepository.save(room);
    } catch (error) {
      throw new ConflictException(`Room with code ${createDto.roomCode} could not be created`);
    }
  }

  /// Actualiza un aula existente
  async update(roomId: number, updateDto: UpdateRoomDto): Promise<RoomEntity> {
    // Buscar el aula a actualizar
    const room = await this.findRoomByIdOrFail(roomId);

    // Si se quiere cambiar el código, verificar unicidad
    if (updateDto.roomCode && updateDto.roomCode !== room.roomCode) {
      await this.ensureRoomCodeIsUnique(updateDto.roomCode);
      room.roomCode = updateDto.roomCode;
    }

    // Actualizar otros campos si vienen en el DTO
    if (updateDto.name !== undefined) {
      room.name = updateDto.name;
    }

    if (updateDto.courseId !== undefined) {
      // Verificar que el curso exista
      let course: CourseEntity | null = null;
      if (updateDto.courseId) {
        course = await this.courseService.findOne(updateDto.courseId);
      }
      room.course = updateDto.courseId ? course : null;
    }

    if (updateDto.capacity !== undefined) {
      room.capacity = updateDto.capacity;
    }

    if (updateDto.building !== undefined) {
      room.building = updateDto.building;
    }

    if (updateDto.floor !== undefined) {
      room.floor = updateDto.floor;
    }

    try {
      return await this.roomRepository.save(room);
    } catch (error) {
      throw new ConflictException(`Room with ID ${roomId} could not be updated`);
    }
  }

  /// Elimina permanentemente un aula (hard delete)
  async delete(roomId: number): Promise<void> {
    // Verifica que el aula existe antes de eliminar
    await this.findRoomByIdOrFail(roomId);
    await this.roomRepository.delete(roomId);
  }

  /// Busca aulas disponibles en una fecha y horario específico
  async findAvailableRooms(findDto: FindAvailableRoomsDto): Promise<RoomEntity[]> {
    // Obtener todas las aulas activas
    const allRooms = await this.roomRepository.findAll();

    // Obtener las aulas ocupadas en el horario especificado
    const occupiedRoomIds = await this.permissionService.findOccupiedRooms(findDto);

    // Filtrar las aulas disponibles (las que NO están ocupadas y tienen capacidad mayor a 0)
    const availableRooms = allRooms.filter(room => 
      !occupiedRoomIds.includes(room.roomId) && room.capacity > 0
    );

    return availableRooms;
  }

  //? ================= Métodos auxiliares =================

  //? Busca un aula por roomId o lanza una excepción si no se encuentra
  private async findRoomByIdOrFail(roomId: number): Promise<RoomEntity> {
    const room = await this.roomRepository.findOneById(roomId);
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }
    return room;
  }

  //? Verifica que el código del aula sea único
  private async ensureRoomCodeIsUnique(roomCode: string): Promise<void> {
    const existing = await this.roomRepository.findOneByRoomCode(roomCode);
    if (existing) {
      throw new ConflictException(`Room with code ${roomCode} already exists`);
    }
  }
}
