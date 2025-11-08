import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, MaxLength } from 'class-validator';

export class CreateReaderRequest {
  @ApiProperty({ description: 'Código único del lector', example: 'READER-A101', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readerCode: string;

  @ApiProperty({ description: 'ID del aula asignada a este lector', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  roomId: number;
}
