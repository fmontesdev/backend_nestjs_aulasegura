import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { AccessMethod } from '../../../domain/enums/access-method.enum';
import { AccessStatus } from '../../../domain/enums/access-status.enum';

export class CreateAccessLogRequest {
  @ApiProperty({ description: 'ID del tag utilizado', example: 1 })
  @IsInt()
  tagId!: number;

  @ApiProperty({ description: 'ID del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  userId!: string;

  @ApiProperty({ description: 'ID del lector', example: 1 })
  @IsInt()
  readerId!: number;

  @ApiProperty({ description: 'ID del aula', example: 1 })
  @IsInt()
  roomId!: number;

  @ApiProperty({ description: 'ID de la asignatura (opcional)', example: 1, nullable: true })
  @IsInt()
  @IsOptional()
  subjectId?: number | null;

  @ApiProperty({ description: 'Método de acceso utilizado', enum: AccessMethod, example: AccessMethod.RFID })
  @IsEnum(AccessMethod)
  accessMethod!: AccessMethod;

  @ApiProperty({ description: 'Estado del acceso', enum: AccessStatus, example: AccessStatus.ALLOWED })
  @IsEnum(AccessStatus)
  accessStatus!: AccessStatus;
}
