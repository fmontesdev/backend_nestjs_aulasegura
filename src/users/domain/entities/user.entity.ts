import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, BeforeInsert } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'user' })
// @Index('IDX_USER_EMAIL', ['email'], { unique: true })
export class UserEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'user_id' })
  userId!: string;

  @BeforeInsert()
  setId() {
      if (!this.userId) {
          this.userId = randomUUID(); // genera UUID v4
      }
  }

  @Column({ type: 'varchar', length: 50, name: 'name' })
  name!: string;

  @Column({ type: 'varchar', length: 100, name: 'lastname' })
  lastname!: string;

  @Column({ type: 'varchar', length: 100, name: 'email', unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 60, name: 'password_hash' })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 255, name: 'avatar', nullable: true })
  avatar?: string | null;

  @Column({ type: 'datetime', name: 'valid_from', default: () => 'CURRENT_TIMESTAMP' })
  validFrom!: Date;

  @Column({ type: 'datetime', name: 'valid_to', nullable: true })
  validTo?: Date | null;

  @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
