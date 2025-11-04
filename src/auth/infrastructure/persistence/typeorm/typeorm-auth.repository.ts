import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { BlacklistTokenEntity } from '../../../domain/entities/blacklist-token.entity';
import { PasswordResetTokenEntity } from '../../../domain/entities/password-reset-token.entity';

@Injectable()
export class TypeormAuthRepository implements AuthRepository {
  constructor(
    @InjectRepository(BlacklistTokenEntity)
    private readonly blacklistTokenRepo: Repository<BlacklistTokenEntity>,
    @InjectRepository(PasswordResetTokenEntity)
    private readonly passwordResetTokenRepo: Repository<PasswordResetTokenEntity>,
  ) {}

  /// Backlist Tokens ///

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const count = await this.blacklistTokenRepo.count({ where: { token } });
    return count > 0;
  }

  async saveBlacklistToken(blacklistToken: BlacklistTokenEntity): Promise<BlacklistTokenEntity> {
    return this.blacklistTokenRepo.save(blacklistToken);
  }

  async deleteExpiredBlacklistTokens(): Promise<void> {
    await this.blacklistTokenRepo.delete({ expiresAt: LessThan(new Date()) });
  }

  /// Password Reset Tokens ///

  async findPasswordResetToken(token: string, userId: string): Promise<PasswordResetTokenEntity | null> {
    return this.passwordResetTokenRepo.findOne({ 
      where: { 
        token, 
        userId,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      } 
    });
  }

  async findPasswordResetTokenByUserId(userId: string): Promise<PasswordResetTokenEntity | null> {
    return this.passwordResetTokenRepo.findOne({ 
      where: { 
        userId,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      } 
    });
  }

  async savePasswordResetToken(resetToken: PasswordResetTokenEntity): Promise<PasswordResetTokenEntity> {
    return this.passwordResetTokenRepo.save(resetToken);
  }

  async invalidateUserPasswordResetTokens(userId: string): Promise<void> {
    await this.passwordResetTokenRepo.update(
      { userId, isUsed: false },
      { isUsed: true }
    );
  }

  async deleteExpiredPasswordResetTokens(): Promise<void> {
    await this.passwordResetTokenRepo.delete({ expiresAt: LessThan(new Date()) });
  }
}
