import { ApiProperty } from '@nestjs/swagger';

export class WeeklyScheduleResponse {
  @ApiProperty({ description: 'Día de la semana (1=Lunes, 7=Domingo)', example: 1 })
  dayOfWeek: number;

  @ApiProperty({ description: 'Hora de inicio (HH:MM:SS)', example: '08:00:00' })
  startTime: string;

  @ApiProperty({ description: 'Hora de fin (HH:MM:SS)', example: '09:00:00' })
  endTime: string;
}
