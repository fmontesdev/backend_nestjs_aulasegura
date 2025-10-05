import { Entity, Column, PrimaryGeneratedColumn, Unique, Index, OneToMany, ManyToOne } from 'typeorm';
import { UserEntity } from '../users/domain/entities/user.entity';
import { AccessLogEntity } from './access-log.entity';

export enum TagType {
  RFID = 'rfid',
  NFC_MOBILE = 'nfc_mobile',
}

@Entity({ name: 'tag' })
@Unique('uq_tag_code', ['tagCode'])
@Index('idx_tag_user', ['userId'])
export class TagEntity {
  @PrimaryGeneratedColumn({ name: 'tag_id', type: 'bigint' })
  tagId!: string;

  @Column({ name: 'tag_code', type: 'varchar', length: 64 })
  tagCode!: string;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId!: string;

  @ManyToOne(() => UserEntity, (u) => u.tags, { onDelete: 'RESTRICT' })
  user!: UserEntity;

  @Column({ name: 'type', type: 'enum', enum: TagType, default: TagType.RFID })
  type!: TagType;

  @Column({ name: 'device_id', type: 'varchar', length: 100, nullable: true })
  deviceId!: string | null;

  @Column({ name: 'issued_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  issuedAt!: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => AccessLogEntity, (al) => al.tag)
  accessLogs!: AccessLogEntity[];
}
