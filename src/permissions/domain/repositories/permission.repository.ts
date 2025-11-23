import { PermissionEntity } from '../entities/permission.entity';
import { ValidateWeeklySchedulePermissionOverlapDto } from '../../../permissions/application/dto/validate-weekly-schedule-permission-overlap.dto';
import { ValidateWeeklyScheduleOverlapDto } from '../../../permissions/application/dto/validate-weekly-schedule-overlap.dto';
import { ValidateEventScheduleOverlapDto } from '../../../permissions/application/dto/validate-event-schedule-overlap.dto';
import { FindOccupiedRoomsDto } from '../../../permissions/application/dto/find-occupied-rooms.dto';

export abstract class PermissionRepository {
  abstract findAll(): Promise<PermissionEntity[]>;
  abstract findOne(userId: string, roomId: number, scheduleId: number): Promise<PermissionEntity | null>;
  abstract findActiveWeeklySchedulesForUser(userId: string, academicYearId: number): Promise<PermissionEntity[]>;
  abstract findActiveReservationsForUser(userId: string, now: Date): Promise<PermissionEntity[]>;
  abstract findWeeklySchedulePermissionOverlappingForRoom(overlapDto: ValidateWeeklySchedulePermissionOverlapDto): Promise<PermissionEntity[]>;
  abstract findWeeklyScheduleOverlappingForRoom(overlapDto: ValidateWeeklyScheduleOverlapDto): Promise<PermissionEntity[]>;
  abstract findEventScheduleOverlappingForRoom(overlapDto: ValidateEventScheduleOverlapDto): Promise<PermissionEntity[]>;
  abstract findActiveWeeklyPermissionForUserAtCurrentTime(
    userId: string,
    roomId: number,
    academicYearId: number,
    dayOfWeek: number,
    currentTime: string,
  ): Promise<PermissionEntity | null>;
  abstract findActiveEventPermissionForUserAtCurrentTime(
    userId: string,
    roomId: number,
    academicYearId: number,
    currentDate: Date,
  ): Promise<PermissionEntity | null>;
  abstract findOccupiedRooms(dto: FindOccupiedRoomsDto): Promise<number[]>;
  abstract save(permission: PermissionEntity): Promise<PermissionEntity>;
  abstract updatePrimaryKeys(
    oldUserId: string,
    oldRoomId: number,
    oldScheduleId: number,
    newUserId: string,
    newRoomId: number,
    newScheduleId: number
  ): Promise<void>;
  abstract hardRemove(userId: string, roomId: number, scheduleId: number): Promise<void>;
}
