import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklyScheduleEntity } from '../../../domain/entities/weekly-schedule.entity';
import { WeeklyScheduleRepository } from '../../../domain/repositories/weekly-schedule.repository';

@Injectable()
export class TypeOrmWeeklyScheduleRepository implements WeeklyScheduleRepository {
  constructor(
    @InjectRepository(WeeklyScheduleEntity)
    private readonly weeklyScheduleRepository: Repository<WeeklyScheduleEntity>,
  ) {}

  /// Busca todos los horarios semanales del actual año académico
  async findAll(): Promise<WeeklyScheduleEntity[]> {
    return await this.weeklyScheduleRepository.find({
      where: { schedule: { academicYear: { isActive: true } } },
      relations: ['schedule', 'schedule.academicYear'],
      order: { scheduleId: 'ASC' },
    });
  }

  /// Busca todos los horarios semanales activos del actual año académico
  async findAllActive(): Promise<WeeklyScheduleEntity[]> {
    return await this.weeklyScheduleRepository
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.schedule', 'schedule')
      .leftJoinAndSelect('schedule.academicYear', 'academicYear')
      .where('schedule.isActive = :isActive', { isActive: true })
      .andWhere('academicYear.isActive = :isActive', { isActive: true })
      .orderBy('ws.scheduleId', 'ASC')
      .getMany();
  }

  /// Busca un horario semanal por ID del actual año académico
  async findOneById(scheduleId: number): Promise<WeeklyScheduleEntity | null> {
    return await this.weeklyScheduleRepository.findOne({
      where: { scheduleId, schedule: { academicYear: { isActive: true } } },
      relations: ['schedule', 'schedule.academicYear'],
    });
  }

  /// Busca un horario semanal activo por ID del actual año académico
  async findOneActiveById(scheduleId: number): Promise<WeeklyScheduleEntity | null> {
    return await this.weeklyScheduleRepository
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.schedule', 'schedule')
      .leftJoinAndSelect('schedule.academicYear', 'academicYear')
      .where('ws.scheduleId = :scheduleId', { scheduleId })
      .andWhere('schedule.isActive = :isActive', { isActive: true })
      .andWhere('academicYear.isActive = :isActive', { isActive: true })
      .getOne();
  }

  /// Guarda un horario semanal
  async save(weeklySchedule: WeeklyScheduleEntity): Promise<WeeklyScheduleEntity> {
    return await this.weeklyScheduleRepository.save(weeklySchedule);
  }
}
