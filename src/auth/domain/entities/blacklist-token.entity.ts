import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Entity({ name: 'blacklist_token' })
export class BlacklistTokenEntity {
  @PrimaryColumn({ name: 'user_id', type: 'char', length: 36 })
  userId!: string;

  @PrimaryColumn({ name: 'token', type: 'varchar', length: 500 })
  token!: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt!: Date;

  @ManyToOne(() => UserEntity, (u) => u.blacklistedTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
