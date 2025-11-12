import { Entity, Column, PrimaryGeneratedColumn, Unique, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { AccessLogEntity } from '../../../access/domain/entities/access-log.entity';
import { TagType } from '../enums/tag-type.enum';

@Entity({ name: 'tag' })
@Unique('uq_tag_code', ['tagCode'])
@Index('idx_tag_user', ['userId'])
export class TagEntity {
  @PrimaryGeneratedColumn({ name: 'tag_id', type: 'int' })
  tagId!: number;

  @Column({ name: 'tag_code', type: 'varchar', length: 64 })
  tagCode!: string;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId!: string;

  @ManyToOne(() => UserEntity, (u) => u.tags, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'type', type: 'enum', enum: TagType, default: TagType.RFID })
  type!: TagType;

  @Column({ name: 'issued_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  issuedAt!: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => AccessLogEntity, (al) => al.tag)
  accessLogs!: AccessLogEntity[];
}
