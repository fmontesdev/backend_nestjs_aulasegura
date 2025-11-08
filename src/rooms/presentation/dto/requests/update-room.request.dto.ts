import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, MaxLength } from 'class-validator';

export class UpdateRoomRequest {
  @ApiPropertyOptional({ description: 'Código único de la sala (generado manualmente)', example: '101', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  roomCode?: string;

  @ApiPropertyOptional({ description: 'Nombre de la sala', example: 'Laboratorio 1', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ description: 'ID del curso asignado a esta sala (null para desasignar)', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  courseId?: number | null;

  @ApiPropertyOptional({ description: 'Capacidad de la sala (número de estudiantes)', example: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ description: 'Número del edificio', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  building?: number;

  @ApiPropertyOptional({ description: 'Número de piso', example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  floor?: number;
}
