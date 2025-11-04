import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Entity({ name: 'password_reset_token' })
export class PasswordResetTokenEntity {
  @PrimaryColumn({ name: 'token', type: 'varchar', length: 6 })
  token!: string;

  @PrimaryColumn({ name: 'user_id', type: 'varchar', length: 36 })
  userId!: string;

  @Column({ name: 'expires_at', type: 'datetime' })
  expiresAt!: Date;

  @Column({ name: 'attempts', type: 'int', default: 0 })
  attempts!: number;

  @Column({ name: 'is_used', type: 'boolean', default: false })
  isUsed!: boolean;

  @Column({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
