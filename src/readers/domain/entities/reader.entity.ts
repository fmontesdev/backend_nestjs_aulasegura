import { Entity, Column, PrimaryGeneratedColumn, Unique, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { RoomEntity } from '../../../rooms/domain/entities/room.entity';
import { AccessLogEntity } from '../../../access/domain/entities/access-log.entity';

@Entity({ name: 'reader' })
@Unique('uq_reader_code', ['readerCode'])
@Index('idx_reader_room', ['roomId'])
export class ReaderEntity {
  @PrimaryGeneratedColumn({ name: 'reader_id', type: 'int' })
  readerId!: number;

  @Column({ name: 'reader_code', type: 'varchar', length: 50 })
  readerCode!: string;

  @Column({ name: 'room_id', type: 'int' })
  roomId!: number;

  @ManyToOne(() => RoomEntity, (r) => r.readers, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'room_id' })
  room!: RoomEntity;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => AccessLogEntity, (al) => al.reader)
  accessLogs!: AccessLogEntity[];
}
