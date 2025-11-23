import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PermissionRepository } from '../../domain/repositories/permission.repository';
import { PermissionEntity } from '../../domain/entities/permission.entity';
import { CreateWeeklySchedulePermissionDto } from '../dto/create-weekly-schedule-permission.dto';
import { UpdateWeeklySchedulePermissionDto } from '../dto/update-weekly-schedule-permission.dto';
import { CreateEventSchedulePermissionDto } from '../dto/create-event-schedule-permission.dto';
import { ValidateWeeklySchedulePermissionOverlapDto } from '../dto/validate-weekly-schedule-permission-overlap.dto';
import { ValidateWeeklyScheduleOverlapDto } from '../dto/validate-weekly-schedule-overlap.dto';
import { ValidateEventScheduleOverlapDto } from '../dto/validate-event-schedule-overlap.dto';
import { FindAvailableRoomsDto } from '../../../rooms/application/dto/find-available-rooms.dto';
import { FindOccupiedRoomsDto } from '../dto/find-occupied-rooms.dto';
import { UsersService } from '../../../users/application/services/users.service';
import { RoomService } from '../../../rooms/application/services/room.service';
import { AcademicYearService } from '../../../academic-years/application/services/academic-year.service';
import { EventScheduleService } from '../../../schedules/application/services/event-schedule.service';
import { ScheduleService } from '../../../schedules/application/services/schedule.service';
import { EventScheduleType } from '../../../schedules/domain/enums/event-schedule-type.enum';
import { EventStatus } from '../../../schedules/domain/enums/event-status.enum';
import { ScheduleType } from '../../../schedules/domain/enums/schedule-type.enum';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => RoomService))
    private readonly roomService: RoomService,
    private readonly academicYearService: AcademicYearService,
    private readonly eventScheduleService: EventScheduleService,
    private readonly scheduleService: ScheduleService,
  ) {}

  /// Obtiene todos los permisos activos
  async findAll(): Promise<PermissionEntity[]> {
    return await this.permissionRepository.findAll();
  }

  /// Obtiene un permiso por su clave compuesta
  async findOne(userId: string, roomId: number, scheduleId: number): Promise<PermissionEntity> {
    return await this.findPermissionOrFail(userId, roomId, scheduleId);
  }

  /// Obtiene las reservas activas de un usuario (vigentes desde ahora)
  async findMyActiveReservations(userId: string): Promise<PermissionEntity[]> {
    const now = new Date();
    return await this.permissionRepository.findActiveReservationsForUser(userId, now);
  }

  /// Obtiene los horarios semanales activos de un usuario
  async findMyWeeklySchedules(userId: string): Promise<PermissionEntity[]> {
    // Obtener el año académico activo
    const activeAcademicYear = await this.academicYearService.findActiveAcademicYear();
    
    return await this.permissionRepository.findActiveWeeklySchedulesForUser(userId, activeAcademicYear.academicYearId);
  }

  /// Crea los permisos para un horario semanal
  async createWeeklySchedule(createDto: CreateWeeklySchedulePermissionDto): Promise<PermissionEntity> {
    // Valida que el usuario existe
    const user = await this.usersService.findOne(createDto.userId);

    // Valida que el aula existe
    const room = await this.roomService.findOne(createDto.roomId);

    // Valida que el horario exista
    const weeklySchedule = await this.scheduleService.findOne(createDto.scheduleId);

    // Valida que no exista solapamiento de horarios para esta aula
    const overlapDto: ValidateWeeklySchedulePermissionOverlapDto = {
      roomId: createDto.roomId,
      scheduleId: createDto.scheduleId
    };
    await this.weeklySchedulePermissionOverlappingForRoom(overlapDto);

    // Crea el permiso con el horario generado
    const permission = new PermissionEntity();
    permission.user = user;
    permission.room = room;
    permission.schedule = weeklySchedule;
    permission.createdById = createDto.createdById;
    permission.isActive = true;

    try {
      // Guarda el permiso
      return await this.permissionRepository.save(permission);
    } catch (error) {
      // Si hay un error, elimina el horario semanal creado para evitar datos huérfanos
      await this.scheduleService.hardRemove(weeklySchedule.scheduleId);
      throw new BadRequestException('Error creating permission: ' + error.message);
    }
  }

  /// Actualiza un horario semanal con su permiso asociado
  async updateWeeklySchedule(
    userId: string,
    roomId: number,
    scheduleId: number,
    currentUser: any,
    updateDto: UpdateWeeklySchedulePermissionDto,
  ): Promise<PermissionEntity> {
    // Verifica que el permiso existe
    const permission = await this.findPermissionOrFail(userId, roomId, scheduleId);

    // Determina nuevos valores (usa los del DTO o mantiene los actuales)
    const newUserId = updateDto.newUserId ?? userId;
    const newRoomId = updateDto.newRoomId ?? roomId;
    const newScheduleId = updateDto.newScheduleId ?? scheduleId;

    // Si cambia el usuario, validar que existe
    if (updateDto.newUserId && updateDto.newUserId !== userId) {
      await this.usersService.findOne(updateDto.newUserId);
    }

    // Si cambia el aula, validar que existe
    if (updateDto.newRoomId && updateDto.newRoomId !== roomId) {
      await this.roomService.findOne(updateDto.newRoomId);
    }

    // Si cambia el horario, validar que existe
    if (updateDto.newScheduleId && updateDto.newScheduleId !== scheduleId) {
      await this.scheduleService.findOne(updateDto.newScheduleId);
    }

    // Actualiza el autor del permiso si hay cambios en createdById
    if (permission.createdById !== currentUser.userId) {
      permission.createdById = currentUser.userId;

      try {
        await this.permissionRepository.save(permission);
      } catch (error) {
        throw new BadRequestException(`Error updating permission userId: ${userId}, roomId: ${roomId}, scheduleId: ${scheduleId}: ${error.message}`);
      }
    }

    // Si cambiaron las claves primarias (userId, roomId o scheduleId), validar que no exista ya un permiso con la combinación y actualizar en la BD
    if ((updateDto.newUserId && updateDto.newUserId !== userId) ||
      (updateDto.newRoomId && updateDto.newRoomId !== roomId) ||
      (updateDto.newScheduleId && updateDto.newScheduleId !== scheduleId)
    ) {
      await this.permissionExists(newUserId, newRoomId, newScheduleId);
      try {
        await this.permissionRepository.updatePrimaryKeys(userId, roomId, scheduleId, newUserId, newRoomId, newScheduleId);
      } catch (error) {
        throw new BadRequestException(`Error updating permission userId: ${userId}, roomId: ${roomId}, scheduleId: ${scheduleId}: ${error.message}`);
      }
    }

    // Devuelve el permiso actualizado
    return await this.findPermissionOrFail(newUserId, newRoomId, newScheduleId);
  }

  /// Crea un horario de evento (reserva / pase temporal) con el permiso asociado
  async createEventSchedule(createDto: CreateEventSchedulePermissionDto, currentUser: any): Promise<PermissionEntity> {
    // Valida que el usuario existe y asigna tipo de evento
    let user: any;
    let type: EventScheduleType;
    if (currentUser.roles.includes('teacher')) {
      user = await this.usersService.findOne(currentUser.userId);
      type = EventScheduleType.RESERVATION;
    } else if (currentUser.roles.includes('janitor')) {
      user = await this.usersService.findOne(createDto.userId!);
      type = EventScheduleType.TEMP_PASS;
    }

    // Valida que el aula existe
    const room = await this.roomService.findOne(createDto.roomId);

    // Obtiene año académico activo
    const activeAcademicYear = await this.academicYearService.findActiveAcademicYear();

    // Valida que no exista solapamiento de horarios semanales para esta aula
    const { dayOfWeek, startTime, endTime } = await this.eventToWeeklyConversion(createDto.startAt, createDto.endAt);
    const weeklyScheduleOverlapDto: ValidateWeeklyScheduleOverlapDto = {
      roomId: createDto.roomId,
      academicYearId: activeAcademicYear.academicYearId,
      dayOfWeek: dayOfWeek,
      startTime: startTime,
      endTime: endTime,
    };
    await this.weeklyScheduleOverlappingForRoom(weeklyScheduleOverlapDto);

    // Valida que no exista solapamiento de horarios de eventos para esta aula
    const eventScheduleOverlapDto: ValidateEventScheduleOverlapDto = {
      roomId: createDto.roomId,
      academicYearId: activeAcademicYear.academicYearId,
      startAt: new Date(createDto.startAt),
      endAt: new Date(createDto.endAt)
    };
    await this.eventScheduleOverlappingForRoom(eventScheduleOverlapDto);

    // Crea el horario de evento
    const status: EventStatus = type! === EventScheduleType.RESERVATION ? EventStatus.PENDING : EventStatus.APPROVED;
    const savedEventSchedule = await this.eventScheduleService.create({
      academicYear: activeAcademicYear,
      type: type!,
      description: createDto.description,
      startAt: new Date(createDto.startAt),
      endAt: new Date(createDto.endAt),
      status: status
    });

    // Asigna la relación inversa para que el mapper pueda acceder
    savedEventSchedule.schedule.eventSchedule = savedEventSchedule;

    // Crea el permiso con el horario generado
    const permission = new PermissionEntity();
    permission.user = user;
    permission.room = room;
    permission.schedule = savedEventSchedule.schedule;
    permission.createdById = currentUser.userId;
    permission.isActive = true;

    try {
      // Guarda el permiso
      return await this.permissionRepository.save(permission);
    } catch (error) {
      // Si hay un error, elimina el horario de evento creado para evitar datos huérfanos
      await this.scheduleService.hardRemove(savedEventSchedule.scheduleId);
      throw new BadRequestException('Error creating permission: ' + error.message);
    }
  }

  /// Desactiva un permiso (soft delete)
  async softRemove(userId: string, roomId: number, scheduleId: number): Promise<void> {
    const permission = await this.findPermissionOrFail(userId, roomId, scheduleId);
    permission.isActive = false;

    try {
      await this.permissionRepository.save(permission);
    } catch (error) {
      throw new BadRequestException(`Error deactivating permission userId: ${userId}, roomId: ${roomId}, scheduleId: ${scheduleId}: ${error.message}`);
    }
  }

  /// Elimina un permiso permanentemente (hard delete)
  async hardRemove(userId: string, roomId: number, scheduleId: number): Promise<void> {
    // Verifica que el permiso existe o lanza NotFoundException
    const permission = await this.findPermissionOrFail(userId, roomId, scheduleId);

    // Elimina el permiso
    try {
      if (permission.schedule.type === ScheduleType.EVENT) {
        await this.scheduleService.hardRemove(scheduleId); // Eliminará en cascada el horario y permiso asociado
      } else if (permission.schedule.type === ScheduleType.WEEKLY) {
        await this.permissionRepository.hardRemove(userId, roomId, scheduleId); // Elimina solo el permiso
      }
    } catch (error) {
      throw new BadRequestException(`Error deleting permission userId: ${userId}, roomId: ${roomId}, scheduleId: ${scheduleId}: ${error.message}`);
    }
  }

  /// Valida si existe algún permiso activo para el usuario en el aula en el momento actual
  async activePermissionAtCurrentTime(userId: string, roomId: number): Promise<PermissionEntity | null> {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay(); // 1=Lunes, 7=Domingo
    const currentTime = currentDate.toTimeString().slice(0, 8); // HH:MM:SS

    // Obtiene año académico activo
    const activeAcademicYear = await this.academicYearService.findActiveAcademicYear();

    // Busca permiso activo con horarios semanales
    const weeklyPermission = await this.permissionRepository.findActiveWeeklyPermissionForUserAtCurrentTime(
      userId,
      roomId,
      activeAcademicYear.academicYearId,
      currentDayOfWeek,
      currentTime,
    );
    if (weeklyPermission !=  null) return weeklyPermission;

    // Busca permiso activo con eventos
    const eventPermission = await this.permissionRepository.findActiveEventPermissionForUserAtCurrentTime(
      userId,
      roomId,
      activeAcademicYear.academicYearId,
      currentDate,
    );
    if (eventPermission != null) return eventPermission;

    return null;
  }

  /// Obtiene los IDs de las aulas ocupadas en una fecha y horario específico
  async findOccupiedRooms(availableDto: FindAvailableRoomsDto): Promise<number[]> {
    // Obtiene año académico activo
    const activeAcademicYear = await this.academicYearService.findActiveAcademicYear();

    // Calcula el día de la semana (1=Lunes, 7=Domingo)
    const dayOfWeek = availableDto.date.getDay() === 0 ? 7 : availableDto.date.getDay();

    const ocuppiedDto: FindOccupiedRoomsDto = {
      academicYearId: activeAcademicYear.academicYearId,
      date: availableDto.date,
      startAt: availableDto.startAt,
      endAt: availableDto.endAt,
      dayOfWeek: dayOfWeek,
    };

    return await this.permissionRepository.findOccupiedRooms(ocuppiedDto);
  }

  //? ================= Métodos auxiliares =================

  //? Busca un permiso o lanza NotFoundException
  private async findPermissionOrFail(userId: string, roomId: number, scheduleId: number): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findOne(userId, roomId, scheduleId);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  //? Verifica que exista un permiso y lanza ConflictException
  private async permissionExists(newUserId: string, newRoomId: number, scheduleId: number): Promise<void> {
    const existingPermission = await this.permissionRepository.findOne(newUserId, newRoomId, scheduleId);
    if (existingPermission) {
      throw new ConflictException(`Permission already exists for user ${newUserId}, room ${newRoomId}, and schedule ${scheduleId}`);
    }
  }

  //? Valida que no exista solapamiento de horarios semanales para un aula específica
  private async weeklySchedulePermissionOverlappingForRoom(overlapDto: ValidateWeeklySchedulePermissionOverlapDto): Promise<void> {
    const overlapping = await this.permissionRepository.findWeeklySchedulePermissionOverlappingForRoom(overlapDto);

    if (overlapping.length > 0) {
      throw new ConflictException('A weekly schedule for this room overlaps with the provided schedule.');
    }
  }

  //? Valida que no exista solapamiento de horarios semanales para un aula específica
  private async weeklyScheduleOverlappingForRoom(overlapDto: ValidateWeeklyScheduleOverlapDto): Promise<void> {
    const overlapping = await this.permissionRepository.findWeeklyScheduleOverlappingForRoom(overlapDto);

    if (overlapping.length > 0) {
      throw new ConflictException('A weekly schedule for this room overlaps with the provided schedule.');
    }
  }

  //? Valida que no exista solapamiento de horarios de eventos para un aula específica
  private async eventScheduleOverlappingForRoom(overlapDto: ValidateEventScheduleOverlapDto): Promise<void> {
    const overlapping = await this.permissionRepository.findEventScheduleOverlappingForRoom(overlapDto);

    if (overlapping.length > 0) {
      throw new ConflictException('An event schedule for this room overlaps with the provided schedule.');
    }
  }

  private async eventToWeeklyConversion(startAt: string, endAt: string): Promise<{ dayOfWeek: number; startTime: string; endTime: string }> {
    const dayOfWeek = new Date(startAt).getDay() === 0 ? 7 : new Date(startAt).getDay(); // Convierte a dia de la semana (lunes=1,domingo=7)
    const startTime = new Date(startAt).toTimeString().slice(0, 8); // Convierte a HH:MM:SS
    const endTime = new Date(endAt).toTimeString().slice(0, 8); // Convierte a HH:MM:SS

    return { dayOfWeek, startTime, endTime };
  }
}
