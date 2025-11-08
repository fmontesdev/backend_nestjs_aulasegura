import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateRoomRequest {
  @ApiProperty({ description: 'Código único de la sala (generado manualmente)', example: '101', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  roomCode: string;

  @ApiProperty({ description: 'Nombre de la sala', example: 'Laboratorio 1', maxLength: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'ID del curso opcional asignado a esta sala', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  courseId?: number;

  @ApiProperty({ description: 'Capacidad de la sala (número de estudiantes)', example: 30 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ description: 'Número del edificio', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  building: number;

  @ApiProperty({ description: 'Número de piso', example: 2 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  floor: number;
}
