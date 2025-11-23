import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from '../../domain/entities/permission.entity';
import { PermissionRepository } from '../../domain/repositories/permission.repository';
import { ScheduleType } from '../../../schedules/domain/enums/schedule-type.enum';
import { ValidateWeeklySchedulePermissionOverlapDto } from '../../application/dto/validate-weekly-schedule-permission-overlap.dto';
import { ValidateWeeklyScheduleOverlapDto } from '../../application/dto/validate-weekly-schedule-overlap.dto';
import { ValidateEventScheduleOverlapDto } from '../../application/dto/validate-event-schedule-overlap.dto';
import { FindOccupiedRoomsDto } from '../../application/dto/find-occupied-rooms.dto';

@Injectable()
export class TypeOrmPermissionRepository implements PermissionRepository {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
  ) {}

  async findAll(): Promise<PermissionEntity[]> {
    return await this.permissionRepo.find({
      where: { isActive: true },
      relations: ['schedule', 'schedule.academicYear', 'schedule.weeklySchedule', 'schedule.eventSchedule'],
      order: { userId: 'ASC', roomId: 'ASC', scheduleId: 'ASC' },
    });
  }

  async findOne(userId: string, roomId: number, scheduleId: number): Promise<PermissionEntity | null> {
    return await this.permissionRepo.findOne({
      where: { userId, roomId, scheduleId },
      relations: ['schedule', 'schedule.academicYear', 'schedule.weeklySchedule', 'schedule.eventSchedule'],
    });
  }

  /// Busca horarios semanales activos para un usuario
  async findActiveWeeklySchedulesForUser(userId: string, academicYearId: number): Promise<PermissionEntity[]> {
    return await this.permissionRepo
      .createQueryBuilder('permission')
      .innerJoinAndSelect('permission.schedule', 'schedule')
      .innerJoinAndSelect('schedule.weeklySchedule', 'weeklySchedule')
      .innerJoinAndSelect('schedule.academicYear', 'academicYear')
      .innerJoinAndSelect('permission.user', 'user')
      .innerJoinAndSelect('permission.room', 'room')
      .where('permission.userId = :userId', { userId })
      .andWhere('permission.isActive = :isActive', { isActive: true })
      .andWhere('schedule.isActive = :scheduleActive', { scheduleActive: true })
      .andWhere('schedule.type = :type', { type: ScheduleType.WEEKLY })
      .andWhere('schedule.academicYearId = :academicYearId', { academicYearId })
      .orderBy('weeklySchedule.dayOfWeek', 'ASC')
      .addOrderBy('weeklySchedule.startTime', 'ASC')
      .getMany();
  }

  /// Busca reservas activas para un usuario
  async findActiveReservationsForUser(userId: string, now: Date): Promise<PermissionEntity[]> {
    return await this.permissionRepo
      .createQueryBuilder('permission')
      .innerJoinAndSelect('permission.schedule', 'schedule')
      .innerJoinAndSelect('schedule.eventSchedule', 'eventSchedule')
      .innerJoinAndSelect('schedule.academicYear', 'academicYear')
      .innerJoinAndSelect('permission.user', 'user')
      .innerJoinAndSelect('permission.room', 'room')
      .where('permission.userId = :userId', { userId })
      .andWhere('permission.isActive = :isActive', { isActive: true })
      .andWhere('schedule.isActive = :scheduleActive', { scheduleActive: true })
      .andWhere('schedule.type = :type', { type: ScheduleType.EVENT })
      .andWhere('eventSchedule.type = :eventType', { eventType: 'reservation' })
      .andWhere('eventSchedule.endAt >= :now', { now })
      .orderBy('eventSchedule.startAt', 'ASC')
      .getMany();
  }

  /// Busca permisos de horario semanal que solapen para un aula dada
  async findWeeklySchedulePermissionOverlappingForRoom(overlapDto: ValidateWeeklySchedulePermissionOverlapDto): Promise<PermissionEntity[]> {
    return await this.permissionRepo
      .createQueryBuilder('permission')
      .innerJoinAndSelect('permission.schedule', 'schedule')
      .innerJoinAndSelect('schedule.weeklySchedule', 'weeklySchedule')
      .where('permission.roomId = :roomId', { roomId: overlapDto.roomId })
      .andWhere('permission.scheduleId = :scheduleId', { scheduleId: overlapDto.scheduleId })
      .andWhere('permission.isActive = :isActive', { isActive: true })
      .andWhere('schedule.isActive = :scheduleActive', { scheduleActive: true })
      .andWhere('schedule.type = :type', { type: ScheduleType.WEEKLY })
      // .andWhere('schedule.academicYearId.isActive = :isActive', { isActive: true })
      .getMany();
  }

  /// Busca horarios semanales que solapen para un aula dada
  async findWeeklyScheduleOverlappingForRoom(overlapDto: ValidateWeeklyScheduleOverlapDto): Promise<PermissionEntity[]> {
    return await this.permissionRepo
      .createQueryBuilder('permission')
      .innerJoinAndSelect('permission.schedule', 'schedule')
      .innerJoinAndSelect('schedule.weeklySchedule', 'weeklySchedule')
      .where('permission.roomId = :roomId', { roomId: overlapDto.roomId })
      .andWhere('permission.isActive = :isActive', { isActive: true })
      .andWhere('schedule.isActive = :scheduleActive', { scheduleActive: true })
      .andWhere('schedule.type = :type', { type: ScheduleType.WEEKLY })
      .andWhere('schedule.academicYearId = :academicYearId', { academicYearId: overlapDto.academicYearId })
      .andWhere('weeklySchedule.dayOfWeek = :dayOfWeek', { dayOfWeek: overlapDto.dayOfWeek })
      // Validación de solapamiento horario: (start1 < end2) AND (start2 < end1)
      .andWhere('weeklySchedule.startTime < :endTime', { endTime: overlapDto.endTime })
      .andWhere(':startTime < weeklySchedule.endTime', { startTime: overlapDto.startTime })
      .getMany();
  }

  /// Busca horarios de evento que solapen para un aula dada
  async findEventScheduleOverlappingForRoom(overlapDto: ValidateEventScheduleOverlapDto): Promise<PermissionEntity[]> {
    return await this.permissionRepo
      .createQueryBuilder('permission')
      .innerJoinAndSelect('permission.schedule', 'schedule')
      .innerJoinAndSelect('schedule.eventSchedule', 'eventSchedule')
      .where('permission.roomId = :roomId', { roomId: overlapDto.roomId })
      .andWhere('permission.isActive = :isActive', { isActive: true })
      .andWhere('schedule.isActive = :scheduleActive', { scheduleActive: true })
      .andWhere('schedule.type = :type', { type: ScheduleType.EVENT })
      .andWhere('schedule.academicYearId = :academicYearId', { academicYearId: overlapDto.academicYearId })
      // Validación de solapamiento de fechas/horas: (start1 < end2) AND (start2 < end1)
      .andWhere('eventSchedule.startAt < :endAt', { endAt: overlapDto.endAt })
      .andWhere(':startAt < eventSchedule.endAt', { startAt: overlapDto.startAt })
      .getMany();
  }

  /// Busca un permiso semanal activo
  async findActiveWeeklyPermissionForUserAtCurrentTime(
    userId: string,
    roomId: number,
    academicYearId: number,
    dayOfWeek: number,
    currentTime: string,
  ): Promise<PermissionEntity | null> {
    const result = await this.permissionRepo
      .createQueryBuilder('permission')
      .innerJoinAndSelect('permission.schedule', 'schedule')
      .innerJoinAndSelect('schedule.weeklySchedule', 'weeklySchedule')
      .innerJoinAndSelect('schedule.academicYear', 'academicYear')
      .innerJoinAndSelect('permission.user', 'user')
      .innerJoinAndSelect('permission.room', 'room')
      .where('permission.userId = :userId', { userId })
      .andWhere('permission.roomId = :roomId', { roomId })
      .andWhere('permission.isActive = :isActive', { isActive: true })
      .andWhere('schedule.isActive = :scheduleActive', { scheduleActive: true })
      .andWhere('schedule.type = :type', { type: ScheduleType.WEEKLY })
      .andWhere('schedule.academicYearId = :academicYearId', { academicYearId })
      .andWhere('weeklySchedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .andWhere('weeklySchedule.startTime <= :currentTime', { currentTime })
      .andWhere('weeklySchedule.endTime >= :currentTime', { currentTime })
      .getMany();

    return result.length > 0 ? result[0] : null;
  }

  /// Busca un permiso de evento activo
  async findActiveEventPermissionForUserAtCurrentTime(
    userId: string,
    roomId: number,
    academicYearId: number,
    currentDate: Date,
  ): Promise<PermissionEntity | null> {
    const result = await this.permissionRepo
      .createQueryBuilder('permission')
      .innerJoinAndSelect('permission.schedule', 'schedule')
      .innerJoinAndSelect('schedule.eventSchedule', 'eventSchedule')
      .innerJoinAndSelect('schedule.academicYear', 'academicYear')
      .innerJoinAndSelect('permission.user', 'user')
      .innerJoinAndSelect('permission.room', 'room')
      .where('permission.userId = :userId', { userId })
      .andWhere('permission.roomId = :roomId', { roomId })
      .andWhere('permission.isActive = :isActive', { isActive: true })
      .andWhere('schedule.isActive = :scheduleActive', { scheduleActive: true })
      .andWhere('schedule.type = :type', { type: ScheduleType.EVENT })
      .andWhere('schedule.academicYearId = :academicYearId', { academicYearId })
      .andWhere('eventSchedule.startAt <= :currentDate', { currentDate })
      .andWhere('eventSchedule.endAt >= :currentDate', { currentDate })
      .getMany();

    return result.length > 0 ? result[0] : null;
  }

  async save(permission: PermissionEntity): Promise<PermissionEntity> {
    return await this.permissionRepo.save(permission);
  }

  /// Actualiza las claves primarias de un permiso
  async updatePrimaryKeys(oldUserId: string, oldRoomId: number, oldScheduleId: number, newUserId: string, newRoomId: number, newScheduleId: number): Promise<void> {
    // Usar queryRunner para transacción manual porque TypeORM no puede actualizar PKs directamente
    const queryRunner = this.permissionRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Actualizar las claves primarias usando SQL directo
      await queryRunner.query(
        `UPDATE permission 
        SET user_id = ?, room_id = ?, schedule_id = ? 
        WHERE user_id = ? AND room_id = ? AND schedule_id = ?`,
        [newUserId, newRoomId, newScheduleId, oldUserId, oldRoomId, oldScheduleId],
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /// Busca aulas ocupadas en un horario específico
  async findOccupiedRooms(dto: FindOccupiedRoomsDto): Promise<number[]> {
    // Buscar aulas ocupadas por horarios semanales
    const weeklyOccupied = await this.permissionRepo
      .createQueryBuilder('permission')
      .select('DISTINCT permission.roomId', 'roomId')
      .innerJoin('permission.schedule', 'schedule')
      .innerJoin('schedule.weeklySchedule', 'weeklySchedule')
      .where('permission.isActive = :isActive', { isActive: true })
      .andWhere('schedule.isActive = :scheduleActive', { scheduleActive: true })
      .andWhere('schedule.type = :type', { type: ScheduleType.WEEKLY })
      .andWhere('schedule.academicYearId = :academicYearId', { academicYearId: dto.academicYearId })
      .andWhere('weeklySchedule.dayOfWeek = :dayOfWeek', { dayOfWeek: dto.dayOfWeek })
      // Validación de solapamiento horario: (start1 < end2) AND (start2 < end1)
      .andWhere('weeklySchedule.startTime < :endTime', { endTime: dto.endAt })
      .andWhere(':startTime < weeklySchedule.endTime', { startTime: dto.startAt })
      .getRawMany(); // Devuelve objetos planos solo con lo seleccionado en .select()

    // Buscar aulas ocupadas por eventos
    const eventOccupied = await this.permissionRepo
      .createQueryBuilder('permission')
      .select('DISTINCT permission.roomId', 'roomId')
      .innerJoin('permission.schedule', 'schedule')
      .innerJoin('schedule.eventSchedule', 'eventSchedule')
      .where('permission.isActive = :isActive', { isActive: true })
      .andWhere('schedule.isActive = :scheduleActive', { scheduleActive: true })
      .andWhere('schedule.type = :type', { type: ScheduleType.EVENT })
      .andWhere('schedule.academicYearId = :academicYearId', { academicYearId: dto.academicYearId })
      // Crear rangos de fecha/hora para el día solicitado
      .andWhere('eventSchedule.startAt < :endAt', { 
        endAt: new Date(`${dto.date.toISOString().split('T')[0]}T${dto.endAt}:00`) 
      })
      .andWhere(':startAt < eventSchedule.endAt', { 
        startAt: new Date(`${dto.date.toISOString().split('T')[0]}T${dto.startAt}:00`) 
      })
      .getRawMany(); // Devuelve objetos planos solo con lo seleccionado en .select()

    // Combinar y eliminar duplicados
    const allOccupied = [...weeklyOccupied, ...eventOccupied];
    const uniqueRoomIds = [...new Set(allOccupied.map(item => parseInt(item.roomId)))];
    
    return uniqueRoomIds;
  }

  async hardRemove(userId: string, roomId: number, scheduleId: number): Promise<void> {
    await this.permissionRepo.delete({ userId, roomId, scheduleId });
  }
}
