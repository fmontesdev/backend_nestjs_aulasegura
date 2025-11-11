import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { WeeklyScheduleEntity } from '../../domain/entities/weekly-schedule.entity';
import { WeeklyScheduleRepository } from '../../domain/repositories/weekly-schedule.repository';
import { UpdateWeeklyScheduleDto } from '../dto/update-weekly-schedule.dto';
import { CreateWeeklyScheduleDto } from '../dto/create-weekly-schedule.dto';
import { ScheduleEntity } from '../../domain/entities/schedule.entity';
import { ScheduleType } from '../../domain/enums/schedule-type.enum';
import { AcademicYearService } from '../../../academic-years/application/services/academic-year.service';
import { ValidateWeeklyScheduleOverlapDto } from 'src/schedules/application/dto/validate-weekly-schedule-overlap.dto';

@Injectable()
export class WeeklyScheduleService {
  constructor(
    private readonly weeklyScheduleRepository: WeeklyScheduleRepository,
    private readonly academicYearService: AcademicYearService,
  ) {}

  /// Busca todos los horarios semanales activos
  async findAll(): Promise<WeeklyScheduleEntity[]> {
    return await this.weeklyScheduleRepository.findAllActive();
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

    // Valida que no exista solapamiento de horarios semanales en el mismo dia de la semana
    await this.weeklyScheduleOverlapping({
      dayOfWeek: createDto.dayOfWeek,
      startTime: createDto.startTime,
      endTime: createDto.endTime,
    });

    // Obtiene el año académico activo
    const activeAcademicYear = await this.academicYearService.findActiveAcademicYear();

    // Crea el Schedule (parent)
    const schedule = new ScheduleEntity();
    schedule.type = ScheduleType.WEEKLY;
    schedule.academicYear = activeAcademicYear;
    schedule.isActive = true;

    // Crea el WeeklySchedule (child)
    const weeklySchedule = new WeeklyScheduleEntity();
    weeklySchedule.schedule = schedule;
    weeklySchedule.dayOfWeek = createDto.dayOfWeek;
    weeklySchedule.startTime = createDto.startTime;
    weeklySchedule.endTime = createDto.endTime;

    // Guarda (gracias a cascade, guardará ambos)
    try {
      return await this.weeklyScheduleRepository.save(weeklySchedule);
    } catch (error) {
      throw new ConflictException('Weekly schedule could not be created');
    }
  }
  
  /// Actualiza un horario semanal
  async update(scheduleId: number, updateDto: UpdateWeeklyScheduleDto): Promise<WeeklyScheduleEntity> {
    // Verifica que el horario semanal existe
    const weeklySchedule = await this.findWeeklyScheduleByIdOrFail(scheduleId);

    // Valida startTime < endTime si ambos están presentes
    const newStartTime = updateDto.startTime ?? weeklySchedule.startTime;
    const newEndTime = updateDto.endTime ?? weeklySchedule.endTime;
    if (updateDto.startTime !== undefined || updateDto.endTime !== undefined) {
      this.startEndTimeValidate(newStartTime, newEndTime);
    }

    // Valida que no exista solapamiento de horarios semanales en el mismo dia de la semana
    const newDayOfWeek = updateDto.dayOfWeek ?? weeklySchedule.dayOfWeek;
    await this.weeklyScheduleOverlapping({
      dayOfWeek: newDayOfWeek,
      startTime: newStartTime,
      endTime: newEndTime,
    });

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

    try {
      return await this.weeklyScheduleRepository.save(weeklySchedule);
    } catch (error) {
      throw new ConflictException(`Weekly schedule with ID ${scheduleId} could not be updated`);
    }
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

  //? Valida que startTime sea menor que endTime
  startEndTimeValidate(startTime: string, endTime: string): void {
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }
  }

  //? Valida que no exista solapamiento de horarios semanales en el mismo dia de la semana
  private async weeklyScheduleOverlapping(overlapDto: ValidateWeeklyScheduleOverlapDto): Promise<void> {
    const overlapping = await this.weeklyScheduleRepository.findWeeklyScheduleOverlapping(overlapDto);

    if (overlapping.length > 0) {
      throw new ConflictException('A weekly schedule for this day overlaps with the provided schedule.');
    }
  }

  // //? Obtiene la fecha actual en formato YYYY-MM-DD
  // private getCurrentDate(): string {
  //   const now = new Date();
  //   return now.toISOString().split('T')[0];
  // }
}
