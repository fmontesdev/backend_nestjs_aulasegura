import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReaderResponse {
  @ApiProperty({ description: 'Identificador único del lector', example: 1 })
  readerId: number;

  @ApiProperty({ description: 'Código único del lector', example: 'READER-A101' })
  readerCode: string;

  @ApiPropertyOptional({ description: 'ID del aula asignada', example: 1, nullable: true })
  roomId?: number | null;

  @ApiPropertyOptional({ description: 'Código del aula asignada', example: 'A101' })
  roomCode?: string;

  @ApiPropertyOptional({ description: 'Nombre del aula asignada', example: 'Laboratorio 1' })
  roomName?: string;

  @ApiProperty({ description: 'Estado activo del lector', example: true })
  isActive: boolean;
}
