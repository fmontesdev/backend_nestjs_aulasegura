import { Injectable, NotFoundException } from '@nestjs/common';
import { ScheduleEntity } from '../../domain/entities/schedule.entity';
import { ScheduleRepository } from '../../domain/repositories/schedule.repository';

@Injectable()
export class ScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  /// Busca todos los schedules activos (weekly y event) del año académico activo
  async findAll(): Promise<ScheduleEntity[]> {
    return await this.scheduleRepository.findAllActive();
  }

  /// Busca un schedule por ID del año académico activo
  async findOne(scheduleId: number): Promise<ScheduleEntity> {
    // Verifica que exista sinó lanza excepción
    const schedule = await this.findScheduleByIdOrFail(scheduleId);
    return schedule;
  }

  /// Desactiva un schedule (soft delete)
  async softRemove(scheduleId: number): Promise<void> {
    // Verifica que existe antes de desactivar
    const schedule = await this.findScheduleByIdOrFail(scheduleId);
    schedule.isActive = false;
    await this.scheduleRepository.save(schedule);
  }

  /// Elimina un schedule permanentemente (hard delete)
  async hardRemove(scheduleId: number): Promise<void> {
    // Verifica que existe antes de eliminar
    await this.findScheduleByIdOrFail(scheduleId);;
    await this.scheduleRepository.delete(scheduleId);
  }

  //? ================= Métodos auxiliares =================

  //? Busca un horario por ID o lanza una excepción
  private async findScheduleByIdOrFail(scheduleId: number): Promise<ScheduleEntity> {
    const schedule = await this.scheduleRepository.findOneById(scheduleId);
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }
    return schedule;
  }

  //? Obtiene la fecha actual en formato YYYY-MM-DD
  private getCurrentDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }
}
