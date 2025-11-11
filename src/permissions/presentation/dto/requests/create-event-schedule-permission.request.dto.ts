import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsInt, IsDateString, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateEventSchedulePermissionRequest {
  @ApiProperty({ description: 'ID del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ description: 'ID del aula', example: 1 })
  @IsNotEmpty()
  @IsInt()
  roomId: number;

  @ApiProperty({ description: 'Descripción del evento', example: 'Examen de evaluación de matemáticas' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  description: string;

  @ApiProperty({ description: 'Fecha y hora de inicio del evento', example: '2024-09-01T08:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  startAt: string;

  @ApiProperty({ description: 'Fecha y hora de fin del evento', example: '2024-09-01T10:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  endAt: string;
}
