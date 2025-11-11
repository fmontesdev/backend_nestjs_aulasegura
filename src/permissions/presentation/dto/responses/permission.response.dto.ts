import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from 'src/users/presentation/dto/responses/user.response.dto';
import { RoomResponse } from 'src/rooms/presentation/dto/responses/room.response.dto';
import { ScheduleResponse } from 'src/schedules/presentation/dto/responses/schedule.response.dto';
import { ScheduleType } from 'src/schedules/domain/enums/schedule-type.enum';

export class PermissionResponse {
  @ApiProperty({
    description: 'Usuario asociado al permiso',
    type: () => UserResponse,
    example: { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Juan Pérez', email: 'juan@example.com' },
  })
  user: UserResponse;

  @ApiProperty({ description: 'Aula asociada al permiso', type: () => RoomResponse, example: { id: 1, name: 'Aula 101' }})
  room: RoomResponse;

  @ApiProperty({
    description: 'Horario semanal asociado al permiso',
    type: () => ScheduleResponse,
    example: {
      id: 1,
      type: ScheduleType.WEEKLY,
      academicYear: { id: 1, code: '2025-2026', isActive: true },
      isActive: true,
      createdAt: '2024-09-01T10:00:00.000Z',
      updatedAt: null,
      weeklySchedule: { dayOfWeek: 1, startTime: '08:00:00', endTime: '10:00:00', validFrom: '2024-09-01', validTo: null },
    },
  })
  schedule: ScheduleResponse;

  @ApiProperty({ description: 'ID del usuario que creó el permiso', type: String, format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
  createdById: string;

  @ApiProperty({ description: 'Fecha de creación', type: String, format: 'date-time', example: '2024-09-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Estado activo del permiso', type: Boolean, example: true })
  isActive: boolean;
}
