import { Entity, Column, PrimaryColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { RoomEntity } from '../../../rooms/domain/entities/room.entity';
import { ScheduleEntity } from '../../../schedules/domain/entities/schedule.entity';

@Entity({ name: 'permission' })
@Index('idx_permission_schedule', ['scheduleId'])
@Index('idx_permission_room', ['roomId'])
@Index('idx_permission_user', ['userId'])
export class PermissionEntity {
  @PrimaryColumn({ name: 'user_id', type: 'char', length: 36 })
  userId!: string;

  @PrimaryColumn({ name: 'room_id', type: 'int' })
  roomId!: number;

  @PrimaryColumn({ name: 'schedule_id', type: 'int' })
  scheduleId!: number;

  @Column({ name: 'created_by', type: 'char', length: 36 })
  createdById!: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToOne(() => UserEntity, (u) => u.permissions, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(() => RoomEntity, (r) => r.permissions, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'room_id' })
  room!: RoomEntity;

  @ManyToOne(() => ScheduleEntity, (s) => s.permissions, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'schedule_id' })
  schedule!: ScheduleEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdBy!: UserEntity;
}
