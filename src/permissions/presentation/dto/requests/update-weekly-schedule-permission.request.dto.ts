import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsInt } from 'class-validator';

export class UpdateWeeklySchedulePermissionRequest {
  @ApiPropertyOptional({ description: 'Nuevo ID del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  newUserId?: string;

  @ApiPropertyOptional({ description: 'Nuevo ID del aula', example: 1 })
  @IsOptional()
  @IsInt()
  newRoomId?: number;

  @ApiPropertyOptional({ description: 'ID del horario', example: 1 })
  @IsOptional()
  @IsInt()
  newScheduleId?: number;
}
