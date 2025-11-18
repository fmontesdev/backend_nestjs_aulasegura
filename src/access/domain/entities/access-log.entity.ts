import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { TagEntity } from '../../../tags/domain/entities/tag.entity';
import { ReaderEntity } from '../../../readers/domain/entities/reader.entity';
import { RoomEntity } from '../../../rooms/domain/entities/room.entity';
import { SubjectEntity } from '../../../subjects/domain/entities/subject.entity';
import { AccessMethod } from '../enums/access-method.enum';
import { AccessStatus } from '../enums/access-status.enum';

@Entity({ name: 'access_log' })
@Index('idx_access_log_subject_id', ['subjectId'])
@Index('idx_access_log_room_id', ['roomId'])
@Index('idx_access_log_reader_id', ['readerId'])
@Index('idx_access_log_user', ['userId'])
@Index('idx_access_log_tag_id', ['tagId'])
export class AccessLogEntity {
  @PrimaryGeneratedColumn({ name: 'access_log_id', type: 'int' })
  accessLogId!: number;

  @Column({ name: 'tag_id', type: 'int', nullable: true })
  tagId!: number | null;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId!: string;

  @Column({ name: 'reader_id', type: 'int' })
  readerId!: number;

  @Column({ name: 'room_id', type: 'int' })
  roomId!: number;

  @Column({ name: 'subject_id', type: 'int', nullable: true })
  subjectId!: number | null;

  @Column({ name: 'access_method', type: 'enum', enum: AccessMethod })
  accessMethod!: AccessMethod;

  @Column({ name: 'access_status', type: 'enum', enum: AccessStatus })
  accessStatus!: AccessStatus;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  // ---- Relaciones por columnas únicas no-PK ----

  @ManyToOne(() => TagEntity, { onDelete: 'RESTRICT', eager: false })
  @JoinColumn({ name: 'tag_id', referencedColumnName: 'tagId' })
  tag!: TagEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user!: UserEntity;

  @ManyToOne(() => ReaderEntity, { onDelete: 'RESTRICT', eager: false })
  @JoinColumn({ name: 'reader_id', referencedColumnName: 'readerId' })
  reader!: ReaderEntity;

  @ManyToOne(() => RoomEntity, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'room_id', referencedColumnName: 'roomId' })
  room!: RoomEntity;

  @ManyToOne(() => SubjectEntity, { onDelete: 'RESTRICT', eager: false })
  @JoinColumn({ name: 'subject_id', referencedColumnName: 'subjectId' })
  subject!: SubjectEntity | null;
}
