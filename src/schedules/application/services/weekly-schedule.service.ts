import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { WeeklyScheduleEntity } from '../../domain/entities/weekly-schedule.entity';
import { WeeklyScheduleRepository } from '../../domain/repositories/weekly-schedule.repository';
import { UpdateWeeklyScheduleDto } from '../dto/update-weekly-schedule.dto';

@Injectable()
export class WeeklyScheduleService {
  constructor(
    private readonly weeklyScheduleRepository: WeeklyScheduleRepository,
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

  /// Actualiza un horario semanal (solo validFrom, validTo)
  // TODO: Implementar validación de solapamiento cuando tengamos el módulo de permisos
  async update(scheduleId: number, updateDto: UpdateWeeklyScheduleDto): Promise<WeeklyScheduleEntity> {
    // Verifica que el horario semanal existe
    const weeklySchedule = await this.findWeeklyScheduleByIdOrFail(scheduleId);

    // Actualiza campos permitidos
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
}
