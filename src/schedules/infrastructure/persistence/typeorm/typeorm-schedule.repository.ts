import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEntity } from '../../../domain/entities/schedule.entity';
import { ScheduleRepository } from '../../../domain/repositories/schedule.repository';
import { ScheduleType } from '../../../domain/enums/schedule-type.enum';

@Injectable()
export class TypeOrmScheduleRepository implements ScheduleRepository {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepo: Repository<ScheduleEntity>,
  ) {}

  /// Busca todos los schedules activos del año académico activo
  async findAllActive(): Promise<ScheduleEntity[]> {
    return this.scheduleRepo
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.academicYear', 'academicYear')
      .leftJoinAndSelect('schedule.weeklySchedule', 'weeklySchedule')
      .leftJoinAndSelect('schedule.eventSchedule', 'eventSchedule')
      .where('schedule.isActive = :isActive', { isActive: true })
      .andWhere('academicYear.isActive = :isActive', { isActive: true })
      .orderBy('schedule.scheduleId', 'ASC')
      .getMany();
  }

  /// Busca un schedule por ID del año académico activo
  async findOneById(scheduleId: number): Promise<ScheduleEntity | null> {
    const schedule = await this.scheduleRepo.findOne({
      where: { scheduleId, academicYear: { isActive: true } },
      relations: ['academicYear', 'weeklySchedule', 'eventSchedule'],
    });

    // Si es Weekly, asegura relación inversa para el mapper
    if (schedule && schedule.type === ScheduleType.WEEKLY && schedule.weeklySchedule) {
      schedule.weeklySchedule.schedule = schedule;
    }
    // Si es Event, asegura relación inversa para el mapper
    if (schedule && schedule.type === ScheduleType.EVENT && schedule.eventSchedule) {
      schedule.eventSchedule.schedule = schedule;
    }

    return schedule;
  }

  /// Desactiva un schedule (soft delete)
  async save(schedule: ScheduleEntity): Promise<ScheduleEntity> {
    return await this.scheduleRepo.save(schedule);
  }

  /// Elimina un schedule permanentemente (hard delete)
  async delete(scheduleId: number): Promise<void> {
    await this.scheduleRepo.delete({ scheduleId });
  }
}
