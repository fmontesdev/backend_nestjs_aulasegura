import { PermissionEntity } from '../entities/permission.entity';
import { ValidateWeeklySchedulePermissionOverlapDto } from 'src/permissions/application/dto/validate-weekly-schedule-permission-overlap.dto';
import { ValidateWeeklyScheduleOverlapDto } from 'src/permissions/application/dto/validate-weekly-schedule-overlap.dto';
import { ValidateEventScheduleOverlapDto } from 'src/permissions/application/dto/validate-event-schedule-overlap.dto';

export abstract class PermissionRepository {
  abstract findAll(): Promise<PermissionEntity[]>;
  abstract findOne(userId: string, roomId: number, scheduleId: number): Promise<PermissionEntity | null>;
  abstract findWeeklySchedulePermissionOverlappingForRoom(overlapDto: ValidateWeeklySchedulePermissionOverlapDto): Promise<PermissionEntity[]>;
  abstract findWeeklyScheduleOverlappingForRoom(overlapDto: ValidateWeeklyScheduleOverlapDto): Promise<PermissionEntity[]>;
  abstract findEventScheduleOverlappingForRoom(overlapDto: ValidateEventScheduleOverlapDto): Promise<PermissionEntity[]>;
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
