import { Entity, PrimaryColumn, Column, BeforeInsert, OneToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { randomUUID } from 'crypto';
import { RoleEntity } from './role.entity';
import { BlacklistTokenEntity } from '../../../auth/domain/entities/blacklist-token.entity';
import { TagEntity } from '../../../tags/domain/entities/tag.entity';
import { NotificationEntity } from '../../../entities/notification.entity';
import { PermissionEntity } from '../../../permissions/domain/entities/permission.entity';
import { TeacherEntity } from './teacher.entity';
import { AccessLogEntity } from '../../../access/domain/entities/access-log.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryColumn({ name: 'user_id', type: 'char', length: 36 })
  userId!: string;

  @BeforeInsert()
  setId() {
    if (!this.userId) this.userId = randomUUID(); // genera UUID v4
  }

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name!: string;

  @Column({ name: 'lastname', type: 'varchar', length: 100 })
  lastname!: string;

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 60 })
  passwordHash!: string;

  @Column({ name: 'avatar', type: 'varchar', length: 255, nullable: true })
  avatar?: string | null;

  @Column({ name: 'valid_from', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  validFrom!: Date;

  @Column({ name: 'valid_to', type: 'datetime', nullable: true })
  validTo?: Date | null;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  // Para invalidar tokens JWT (1 por cada dispositivo del usuario) emitidos después de un cambio de contraseña o una revocación manual
  @Column({ name: 'token_version', type: 'int', default: 1 })
  tokenVersion!: number;

  // --- Relations ---

  @ManyToMany(() => RoleEntity, (r) => r.users, { cascade: false })
  @JoinTable({
    name: 'role_user',
    joinColumn: { name: 'user_id', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'roleId' },
  })
  roles!: RoleEntity[];

  @OneToMany(() => BlacklistTokenEntity, (bt) => bt.user, { onDelete: 'CASCADE' })
  blacklistedTokens!: BlacklistTokenEntity[];

  @OneToMany(() => TagEntity, (t) => t.user)
  tags!: TagEntity[];

  @ManyToMany(() => NotificationEntity, (n) => n.users, { cascade: false })
  @JoinTable({
    name: 'notification_user',
    joinColumn: { name: 'user_id', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'notification_id', referencedColumnName: 'notificationId' },
  })
  notifications!: NotificationEntity[];

  @OneToMany(() => PermissionEntity, (p) => p.user)
  permissions!: PermissionEntity[];

  @OneToOne(() => TeacherEntity, (t) => t.user )
  teacher!: TeacherEntity;

  @OneToMany(() => AccessLogEntity, (al) => al.user)
  accessLogs!: AccessLogEntity[];
}
