import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, Matches } from 'class-validator';

export class FindAvailableRoomsRequest {
  @ApiProperty({
    description: 'Fecha para consultar disponibilidad (formato: YYYY-MM-DD)',
    example: '2025-11-22',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Hora de inicio (formato: HH:MM)',
    example: '09:00',
  })
  @IsNotEmpty()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime must be in HH:MM format (24-hour)',
  })
  startAt: string;

  @ApiProperty({
    description: 'Hora de fin (formato: HH:MM)',
    example: '11:00',
  })
  @IsNotEmpty()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime must be in HH:MM format (24-hour)',
  })
  endAt: string;
}
