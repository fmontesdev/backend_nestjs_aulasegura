import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReaderResponse } from '../../../../readers/presentation/dto/responses/reader.response.dto';

export class RoomResponse {
  @ApiProperty({ description: 'Identificador único de la sala', example: 1 })
  roomId: number;

  @ApiProperty({ description: 'Código único de la sala', example: '101' })
  roomCode: string;

  @ApiProperty({ description: 'Nombre de la sala', example: 'Laboratorio 1' })
  name: string;

  @ApiPropertyOptional({ description: 'Nombre del curso asignado a esta sala (si aplica)', example: '2º DAM', nullable: true })
  courseName: string | null;

  @ApiProperty({ description: 'Capacidad de la sala (número de estudiantes)', example: 30 })
  capacity: number;

  @ApiProperty({ description: 'Número del edificio', example: 1 })
  building: number;

  @ApiProperty({ description: 'Número del piso', example: 2 })
  floor: number;

  @ApiProperty({ description: 'Lista de lectores asignados a esta sala', type: [ReaderResponse] })
  readers: ReaderResponse[];
}
