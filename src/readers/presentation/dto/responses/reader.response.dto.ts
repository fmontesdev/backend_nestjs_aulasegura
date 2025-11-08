import { ApiProperty } from '@nestjs/swagger';

export class ReaderResponse {
  @ApiProperty({ description: 'Identificador único del lector', example: 1 })
  readerId: number;

  @ApiProperty({ description: 'Código único del lector', example: 'READER-A101' })
  readerCode: string;

  @ApiProperty({ description: 'ID del aula asignada', example: 1 })
  roomId?: number;

  @ApiProperty({ description: 'Estado activo del lector', example: true })
  isActive: boolean;
}
