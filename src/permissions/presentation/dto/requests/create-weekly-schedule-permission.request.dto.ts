import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsInt } from 'class-validator';

export class CreateWeeklySchedulePermissionRequest {
  @ApiProperty({ description: 'ID del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID del aula', example: 1 })
  @IsNotEmpty()
  @IsInt()
  roomId: number;

  @ApiProperty({ description: 'ID del horario', example: 1 })
  @IsNotEmpty()
  @IsInt()
  scheduleId: number;
}
