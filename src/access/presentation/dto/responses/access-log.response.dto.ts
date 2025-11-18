import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from 'src/users/presentation/dto/responses/user.response.dto';
import { RoomResponse } from 'src/rooms/presentation/dto/responses/room.response.dto';
import { AccessMethod } from '../../../domain/enums/access-method.enum';
import { AccessStatus } from '../../../domain/enums/access-status.enum';

export class AccessLogResponse {
  @ApiProperty({ description: 'ID del registro de acceso', example: 1 })
  accessLogId: number;

  @ApiProperty({ description: 'ID del tag utilizado', example: 1, nullable: true })
  tagId: number | null;

  @ApiProperty({ description: 'Usuario asociado al registro de acceso', type: () => UserResponse })
  user: UserResponse;

  @ApiProperty({ description: 'ID del lector', example: 1 })
  readerId: number;

  @ApiProperty({ description: 'ID del aula', type: () => RoomResponse })
  room: RoomResponse;

  @ApiProperty({ description: 'ID de la asignatura', example: 1, nullable: true })
  subjectId: number | null;

  @ApiProperty({ description: 'Método de acceso utilizado', enum: AccessMethod, example: AccessMethod.RFID })
  accessMethod: AccessMethod;

  @ApiProperty({ description: 'Estado del acceso', enum: AccessStatus, example: AccessStatus.ALLOWED })
  accessStatus: AccessStatus;

  @ApiProperty({ description: 'Fecha y hora del acceso', example: '2025-11-10T14:30:00Z' })
  createdAt: Date;
}
