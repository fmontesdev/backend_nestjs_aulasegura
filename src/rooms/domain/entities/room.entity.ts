import { Entity, Column, PrimaryGeneratedColumn, Unique, Index, OneToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CourseEntity } from '../../../courses/domain/entities/course.entity';
import { PermissionEntity } from '../../../permissions/domain/entities/permission.entity';
import { ReaderEntity } from '../../../readers/domain/entities/reader.entity';
import { AccessLogEntity } from '../../../access/domain/entities/access-log.entity';

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

  @OneToOne(() => CourseEntity, (c) => c.room, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'course_id', referencedColumnName: 'courseId' })
  course!: CourseEntity | null;

  @Column({ name: 'capacity', type: 'smallint' })
  capacity!: number;

  @Column({ name: 'building', type: 'smallint' })
  building!: number;

  @Column({ name: 'floor', type: 'smallint' })
  floor!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => PermissionEntity, (p) => p.room)
  permissions!: PermissionEntity[];

  @OneToMany(() => ReaderEntity, (r) => r.room)
  readers!: ReaderEntity[];

  @OneToMany(() => AccessLogEntity, (al) => al.room)
  accessLogs!: AccessLogEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
