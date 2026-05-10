import { ApiProperty } from '@nestjs/swagger';
import { RoleName } from '../../../../users/domain/enums/rolename.enum';

export class AccessAnalyticsKpisResponse {
  @ApiProperty({ example: 356 })
  totalAccesses: number;

  @ApiProperty({ example: 320 })
  allowedAccesses: number;

  @ApiProperty({ example: 28 })
  deniedAccesses: number;

  @ApiProperty({ example: 7.9 })
  denialRate: number;
}

export class TopDeniedRoomResponse {
  @ApiProperty({ example: 12 })
  roomId: number;

  @ApiProperty({ example: 'Aula 25' })
  roomCode: string;

  @ApiProperty({ example: 'Aula 25' })
  roomName: string;

  @ApiProperty({ example: 1 })
  building: number;

  @ApiProperty({ example: 2 })
  floor: number;

  @ApiProperty({ example: 8 })
  deniedCount: number;
}

export class TopDeniedUserResponse {
  @ApiProperty({ example: 'uuid' })
  userId: string;

  @ApiProperty({ example: 'Juan' })
  name: string;

  @ApiProperty({ example: 'Pérez' })
  lastname: string;

  @ApiProperty({ example: 'juan@demo.com' })
  email: string;

  @ApiProperty({ example: null, nullable: true })
  avatar: string | null;

  @ApiProperty({ enum: RoleName, isArray: true, example: [RoleName.TEACHER] })
  roles: RoleName[];

  @ApiProperty({ example: 5 })
  deniedCount: number;
}

export class HourlyActivityResponse {
  @ApiProperty({ example: 8 })
  hour: number;

  @ApiProperty({ example: 24 })
  total: number;

  @ApiProperty({ example: 22 })
  allowed: number;

  @ApiProperty({ example: 2 })
  denied: number;

  @ApiProperty({ example: 1 })
  timeout: number;

  @ApiProperty({ example: 1 })
  exit: number;
}

export class AccessAnalyticsSummaryResponse {
  @ApiProperty({ type: AccessAnalyticsKpisResponse })
  kpis: AccessAnalyticsKpisResponse;

  @ApiProperty({ type: [TopDeniedRoomResponse] })
  topDeniedRooms: TopDeniedRoomResponse[];

  @ApiProperty({ type: [TopDeniedUserResponse] })
  topDeniedUsers: TopDeniedUserResponse[];

  @ApiProperty({ type: [HourlyActivityResponse] })
  hourlyActivity: HourlyActivityResponse[];
}
