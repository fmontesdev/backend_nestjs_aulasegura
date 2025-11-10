import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { EventScheduleEntity } from '../../domain/entities/event-schedule.entity';
import { EventScheduleRepository } from '../../domain/repositories/event-schedule.repository';
import { UpdateEventScheduleDto } from '../dto/update-event-schedule.dto';
import { CreateEventScheduleDto } from '../dto/create-event-schedule.dto';
import { ScheduleEntity } from '../../domain/entities/schedule.entity';
import { ScheduleType } from '../../domain/enums/schedule-type.enum';
import { EventStatus } from 'src/schedules/domain/enums/event-status.enum';
import { AcademicYearService } from '../../../academic-years/application/services/academic-year.service';

@Injectable()
export class EventScheduleService {
  constructor(
    private readonly eventScheduleRepository: EventScheduleRepository,
    private readonly academicYearService: AcademicYearService,
  ) {}

  /// Busca todos los horarios de eventos activos
  async findAll(): Promise<EventScheduleEntity[]> {
    return await this.eventScheduleRepository.findAllActive();
  }

  /// Busca un horario de evento por ID
  async findOne(scheduleId: number): Promise<EventScheduleEntity> {
    const eventSchedule = await this.findEventScheduleByIdOrFail(scheduleId);
    return eventSchedule;
  }

  /// Crea un nuevo horario de evento
  async create(createDto: CreateEventScheduleDto): Promise<EventScheduleEntity> {
    // Valida que startAt < endAt
    this.startEndTimeValidate(createDto.startAt, createDto.endAt);

    // Crea el Schedule (parent)
    const schedule = new ScheduleEntity();
    schedule.type = ScheduleType.EVENT;
    schedule.academicYear = createDto.academicYear;
    schedule.isActive = true;

    // Crea el EventSchedule (child)
    const eventSchedule = new EventScheduleEntity();
    eventSchedule.schedule = schedule;
    eventSchedule.type = createDto.type;
    eventSchedule.description = createDto.description;
    eventSchedule.startAt = createDto.startAt;
    eventSchedule.endAt = createDto.endAt;
    eventSchedule.status = EventStatus.PENDING;

    // Guarda (gracias a cascade, guardará ambos)
    try {
      return await this.eventScheduleRepository.save(eventSchedule);
    } catch (error) {
      throw new ConflictException('Event schedule could not be created');
    }
  }

  /// Actualiza un horario de evento
  async update(scheduleId: number, updateDto: UpdateEventScheduleDto): Promise<EventScheduleEntity> {
    // Verifica que el horario de evento existe
    const eventSchedule = await this.findEventScheduleByIdOrFail(scheduleId);

    // Valida startAt < endAt si ambos están presentes
    const newStartAt = updateDto.startAt ?? eventSchedule.startAt;
    const newEndAt = updateDto.endAt ?? eventSchedule.endAt;
    this.startEndTimeValidate(newStartAt, newEndAt);

    // Actualiza campos permitidos
    if (updateDto.description !== undefined) {
      eventSchedule.description = updateDto.description;
    }

    if (updateDto.startAt !== undefined) {
      eventSchedule.startAt = updateDto.startAt;
    }

    if (updateDto.endAt !== undefined) {
      eventSchedule.endAt = updateDto.endAt;
    }

    if (updateDto.status !== undefined) {
      eventSchedule.status = updateDto.status;
    }

    if (updateDto.reservationStatusReason !== undefined) {
      eventSchedule.reservationStatusReason = updateDto.reservationStatusReason;
    }

    try {
      return await this.eventScheduleRepository.save(eventSchedule);
    } catch (error) {
      throw new ConflictException(`Event schedule with ID ${scheduleId} could not be updated`);
    }
  }

  //? ================= Métodos auxiliares =================

  //? Busca un horario de evento por ID o lanza una excepción
  private async findEventScheduleByIdOrFail(scheduleId: number): Promise<EventScheduleEntity> {
    const eventSchedule = await this.eventScheduleRepository.findOneById(scheduleId);
    if (!eventSchedule) {
      throw new NotFoundException(`Event schedule with ID ${scheduleId} not found`);
    }
    return eventSchedule;
  }

  //? Valida que startAt sea menor que endAt
  startEndTimeValidate(startAt: Date, endAt: Date): void {
    if (startAt >= endAt) {
      throw new BadRequestException('Start time must be before end time');
    }
  }
}
