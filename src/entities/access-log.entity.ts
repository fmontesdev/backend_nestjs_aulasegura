import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../users/domain/entities/user.entity';
import { TagEntity } from './tag.entity';
import { ReaderEntity } from './reader.entity';
import { RoomEntity } from './room.entity';
import { SubjectEntity } from 'src/subjects/domain/entities/subject.entity';

export enum AccessStatus {
  ALLOWED = 'allowed',
  DENIED = 'denied',
  EXIT = 'exit',
  TIMEOUT = 'timeout',
}
export enum AccessMethod {
  RFID = 'rfid',
  NFC = 'nfc',
  QR = 'qr',
}

@Entity({ name: 'access_log' })
@Index('idx_access_log_classroom_code', ['classroomCode'])
@Index('idx_access_log_subject_code', ['subjectCode'])
@Index('idx_access_log_user', ['userId'])
@Index('idx_access_log_reader_code', ['readerCode'])
@Index('idx_access_log_tag_code', ['tagCode'])
export class AccessLogEntity {
  @PrimaryGeneratedColumn({ name: 'access_log_id', type: 'bigint' })
  accessLogId!: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'tag_code', type: 'varchar', length: 64 })
  tagCode!: string;

  @Column({ name: 'reader_code', type: 'varchar', length: 50 })
  readerCode!: string;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId!: string;

  @Column({ name: 'subject_code', type: 'varchar', length: 50, nullable: true })
  subjectCode!: string | null;

  @Column({ name: 'classroom_code', type: 'varchar', length: 20 })
  classroomCode!: string;

  @Column({ name: 'status', type: 'enum', enum: AccessStatus })
  status!: AccessStatus;

  @Column({ name: 'access_method', type: 'enum', enum: AccessMethod })
  accessMethod!: AccessMethod;

  // ---- Relaciones por columnas únicas no-PK ----

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT', eager: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user!: UserEntity;

  @ManyToOne(() => TagEntity, { onDelete: 'RESTRICT', eager: false })
  @JoinColumn({ name: 'tag_code', referencedColumnName: 'tagCode' })
  tag!: TagEntity;

  @ManyToOne(() => ReaderEntity, { onDelete: 'RESTRICT', eager: false })
  @JoinColumn({ name: 'reader_code', referencedColumnName: 'readerCode' })
  reader!: ReaderEntity;

  @ManyToOne(() => RoomEntity, { onDelete: 'RESTRICT', eager: false })
  @JoinColumn({ name: 'classroom_code', referencedColumnName: 'roomCode' })
  room!: RoomEntity;

  @ManyToOne(() => SubjectEntity, { onDelete: 'RESTRICT', eager: false })
  @JoinColumn({ name: 'subject_code', referencedColumnName: 'subjectCode' })
  subject!: SubjectEntity | null;
}
