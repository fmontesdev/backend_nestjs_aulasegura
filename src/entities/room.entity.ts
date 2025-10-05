import { Entity, Column, PrimaryGeneratedColumn, Unique, Index, OneToOne, OneToMany, JoinColumn  } from 'typeorm';
import { CourseEntity } from './course.entity';
import { PermissionEntity } from './permission.entity';
import { ReaderEntity } from './reader.entity';
import { AccessLogEntity } from './access-log.entity';

export enum RoomFloor {
  P1 = 'P1',
  P2 = 'P2',
}

@Entity({ name: 'room' })
@Unique('uq_room_code', ['roomCode'])
@Index('idx_room_course', ['courseId'])
export class RoomEntity {
  @PrimaryGeneratedColumn({ name: 'room_id', type: 'int' })
  roomId!: number;

  @Column({ name: 'room_code', type: 'varchar', length: 20 })
  roomCode!: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name!: string;

  @Column({ name: 'course_id', type: 'int', nullable: true, unique: true })
  courseId!: number | null;

  @OneToOne(() => CourseEntity, (c) => c.room, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'course_id', referencedColumnName: 'courseId' })
  course!: CourseEntity | null;

  @Column({ name: 'capacity', type: 'smallint' })
  capacity!: number;

  @Column({ name: 'floor', type: 'enum', enum: RoomFloor })
  floor!: RoomFloor;

  @OneToMany(() => PermissionEntity, (p) => p.room)
  permissions!: PermissionEntity[];

  @OneToMany(() => ReaderEntity, (r) => r.room)
  readers!: ReaderEntity[];

  @OneToMany(() => AccessLogEntity, (al) => al.room)
  accessLogs!: AccessLogEntity[];
}
