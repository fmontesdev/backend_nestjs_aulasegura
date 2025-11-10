import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { ScheduleEntity } from 'src/schedules/domain/entities/schedule.entity';
import { EventScheduleEntity } from '../../../domain/entities/event-schedule.entity';
import { EventScheduleRepository } from '../../../domain/repositories/event-schedule.repository';

@Injectable()
export class TypeOrmEventScheduleRepository implements EventScheduleRepository {
  constructor(
    // @InjectRepository(ScheduleEntity)
    // private readonly scheduleRepository: Repository<ScheduleEntity>,
    @InjectRepository(EventScheduleEntity)
    private readonly eventScheduleRepository: Repository<EventScheduleEntity>,
  ) {}

  /// Busca todos los horarios de eventos del actual año académico
  async findAll(): Promise<EventScheduleEntity[]> {
    return await this.eventScheduleRepository.find({
      where: { schedule: { academicYear: { isActive: true } } },
      relations: ['schedule', 'schedule.academicYear'],
      order: { scheduleId: 'ASC' },
    });
  }

  /// Busca todos los horarios de eventos activos del actual año académico
  async findAllActive(): Promise<EventScheduleEntity[]> {
    return await this.eventScheduleRepository
      .createQueryBuilder('es')
      .leftJoinAndSelect('es.schedule', 'schedule')
      .leftJoinAndSelect('schedule.academicYear', 'academicYear')
      .where('schedule.isActive = :isActive', { isActive: true })
      .andWhere('academicYear.isActive = :isActive', { isActive: true })
      .orderBy('es.scheduleId', 'ASC')
      .getMany();
  }

  /// Busca un horario de evento por ID del actual año académico
  async findOneById(scheduleId: number): Promise<EventScheduleEntity | null> {
    return await this.eventScheduleRepository.findOne({
      where: { scheduleId, schedule: { academicYear: { isActive: true } } },
      relations: ['schedule', 'schedule.academicYear'],
    });
  }

  /// Guarda un horario de evento
  async save(eventSchedule: EventScheduleEntity): Promise<EventScheduleEntity> {
    return await this.eventScheduleRepository.save(eventSchedule);
  }
}
