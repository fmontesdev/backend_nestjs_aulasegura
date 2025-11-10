import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { WeeklyScheduleEntity } from '../../domain/entities/weekly-schedule.entity';
import { WeeklyScheduleRepository } from '../../domain/repositories/weekly-schedule.repository';
import { UpdateWeeklyScheduleDto } from '../dto/update-weekly-schedule.dto';
import { CreateWeeklyScheduleDto } from '../dto/create-weekly-schedule.dto';
import { ScheduleEntity } from '../../domain/entities/schedule.entity';
import { ScheduleType } from '../../domain/enums/schedule-type.enum';
import { AcademicYearService } from '../../../academic-years/application/services/academic-year.service';

@Injectable()
export class WeeklyScheduleService {
  constructor(
    private readonly weeklyScheduleRepository: WeeklyScheduleRepository,
    private readonly academicYearService: AcademicYearService,
  ) {}

  /// Busca todos los horarios semanales activos
  async findAll(): Promise<WeeklyScheduleEntity[]> {
    const currentDate = this.getCurrentDate();
    return await this.weeklyScheduleRepository.findAllActive(currentDate);
  }

  /// Busca un horario semanal por ID
  async findOne(scheduleId: number): Promise<WeeklyScheduleEntity> {
    const weeklySchedule = await this.findWeeklyScheduleByIdOrFail(scheduleId);
    return weeklySchedule;
  }

  /// Crea un nuevo horario semanal
  async create(createDto: CreateWeeklyScheduleDto): Promise<WeeklyScheduleEntity> {
    // Valida que startTime < endTime
    this.startEndTimeValidate(createDto.startTime, createDto.endTime);

    // Crea el Schedule (parent)
    const schedule = new ScheduleEntity();
    schedule.type = ScheduleType.WEEKLY;
    schedule.academicYear = createDto.academicYear;
    schedule.isActive = true;

    // Crea el WeeklySchedule (child)
    const weeklySchedule = new WeeklyScheduleEntity();
    weeklySchedule.schedule = schedule;
    weeklySchedule.dayOfWeek = createDto.dayOfWeek;
    weeklySchedule.startTime = createDto.startTime;
    weeklySchedule.endTime = createDto.endTime;
    weeklySchedule.validFrom = createDto.validFrom;
    weeklySchedule.validTo = createDto.validTo ?? null;

    // Guarda (gracias a cascade, guardará ambos)
    return await this.weeklyScheduleRepository.save(weeklySchedule);
  }

  /// Actualiza un horario semanal
  async update(scheduleId: number, updateDto: UpdateWeeklyScheduleDto): Promise<WeeklyScheduleEntity> {
    // Verifica que el horario semanal existe
    const weeklySchedule = await this.findWeeklyScheduleByIdOrFail(scheduleId);

    // Valida startTime < endTime si ambos están presentes
    const newStartTime = updateDto.startTime ?? weeklySchedule.startTime;
    const newEndTime = updateDto.endTime ?? weeklySchedule.endTime;
    this.startEndTimeValidate(newStartTime, newEndTime);

    // Actualiza campos permitidos
    if (updateDto.dayOfWeek !== undefined) {
      weeklySchedule.dayOfWeek = updateDto.dayOfWeek;
    }

    if (updateDto.startTime !== undefined) {
      weeklySchedule.startTime = updateDto.startTime;
    }

    if (updateDto.endTime !== undefined) {
      weeklySchedule.endTime = updateDto.endTime;
    }

    if (updateDto.validFrom !== undefined) {
      weeklySchedule.validFrom = updateDto.validFrom;
    }

    if (updateDto.validTo !== undefined) {
      weeklySchedule.validTo = updateDto.validTo;
    }

    try {
      return await this.weeklyScheduleRepository.save(weeklySchedule);
    } catch (error) {
      throw new ConflictException(`Weekly schedule with ID ${scheduleId} could not be updated`);
    }
  }

  /// Desactiva un horario semanal (soft delete)
  async softRemove(scheduleId: number): Promise<void> {
    const weeklySchedule = await this.findWeeklyScheduleByIdOrFail(scheduleId);
    weeklySchedule.schedule.isActive = false;
    await this.weeklyScheduleRepository.save(weeklySchedule);
  }

  /// Desactiva un horario semanal (soft delete)
  async hardRemove(scheduleId: number): Promise<void> {
    const weeklySchedule = await this.findWeeklyScheduleByIdOrFail(scheduleId);
    await this.weeklyScheduleRepository.deleteById(weeklySchedule.scheduleId);
  }

  //? ================= Métodos auxiliares =================

  //? Busca un horario semanal por ID o lanza una excepción
  private async findWeeklyScheduleByIdOrFail(scheduleId: number): Promise<WeeklyScheduleEntity> {
    const weeklySchedule = await this.weeklyScheduleRepository.findOneById(scheduleId);
    if (!weeklySchedule) {
      throw new NotFoundException(`Weekly schedule with ID ${scheduleId} not found`);
    }
    return weeklySchedule;
  }

  //? Obtiene la fecha actual en formato YYYY-MM-DD
  private getCurrentDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  //? Valida que startTime sea menor que endTime
  startEndTimeValidate(startTime: string, endTime: string): void {
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }
  }
}
