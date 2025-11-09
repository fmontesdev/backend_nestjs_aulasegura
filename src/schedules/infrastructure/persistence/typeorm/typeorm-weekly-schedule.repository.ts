import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklyScheduleEntity } from '../../../domain/entities/weekly-schedule.entity';
import { WeeklyScheduleRepository } from '../../../domain/repositories/weekly-schedule.repository';

@Injectable()
export class TypeOrmWeeklyScheduleRepository implements WeeklyScheduleRepository {
  constructor(
    @InjectRepository(WeeklyScheduleEntity)
    private readonly repository: Repository<WeeklyScheduleEntity>,
  ) {}

  /// Busca todos los horarios semanales del actual año académico
  async findAll(): Promise<WeeklyScheduleEntity[]> {
    return this.repository.find({
      where: { schedule: { academicYear: { isActive: true } } },
      relations: ['schedule', 'schedule.academicYear'],
      order: { scheduleId: 'ASC' },
    });
  }

  /// Busca todos los horarios semanales activos del actual año académico
  async findAllActive(currentDate: string): Promise<WeeklyScheduleEntity[]> {
    return this.repository
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.schedule', 'schedule')
      .leftJoinAndSelect('schedule.academicYear', 'academicYear')
      .where('schedule.isActive = :isActive', { isActive: true })
      .andWhere('academicYear.isActive = :isActive', { isActive: true })
      .andWhere('ws.validFrom <= :currentDate', { currentDate })
      .andWhere('(ws.validTo >= :currentDate OR ws.validTo IS NULL)', { currentDate })
      .orderBy('ws.scheduleId', 'ASC')
      .getMany();
  }

  /// Busca un horario semanal por ID del actual año académico
  async findOneById(scheduleId: number): Promise<WeeklyScheduleEntity | null> {
    return this.repository.findOne({
      where: { scheduleId, schedule: { academicYear: { isActive: true } } },
      relations: ['schedule', 'schedule.academicYear'],
    });
  }

  /// Busca un horario semanal activo por ID del actual año académico
  async findOneActiveById(scheduleId: number, currentDate: string): Promise<WeeklyScheduleEntity | null> {
    return this.repository
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.schedule', 'schedule')
      .leftJoinAndSelect('schedule.academicYear', 'academicYear')
      .where('ws.scheduleId = :scheduleId', { scheduleId })
      .andWhere('academicYear.isActive = :isActive', { isActive: true })
      .andWhere('schedule.isActive = :isActive', { isActive: true })
      .andWhere('ws.validFrom <= :currentDate', { currentDate })
      .andWhere('ws.validTo >= :currentDate OR ws.validTo IS NULL', { currentDate })
      .getOne();
  }

  /// Guarda un horario semanal
  async save(weeklySchedule: WeeklyScheduleEntity): Promise<WeeklyScheduleEntity> {
    return this.repository.save(weeklySchedule);
  }
}
