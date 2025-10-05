import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'blacklist_token' })
export class BlacklistTokenEntity {
  @PrimaryColumn({ name: 'user_id', type: 'char', length: 36 })
  userId!: string;

  @PrimaryColumn({ name: 'refresh_token', type: 'varchar', length: 500 })
  refreshToken!: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt!: Date;

  @ManyToOne(() => UserEntity, (u) => u.blacklistedTokens, { onDelete: 'CASCADE' })
  user!: UserEntity;
}
