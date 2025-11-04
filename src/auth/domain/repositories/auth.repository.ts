import { BlacklistTokenEntity } from '../entities/blacklist-token.entity';
import { PasswordResetTokenEntity } from '../entities/password-reset-token.entity';

export abstract class AuthRepository {
  /// Blacklist tokens
  abstract isTokenBlacklisted(token: string): Promise<boolean>;
  abstract saveBlacklistToken(blacklistToken: BlacklistTokenEntity): Promise<BlacklistTokenEntity>;
  abstract deleteExpiredBlacklistTokens(): Promise<void>;

  /// Password reset tokens
  abstract findPasswordResetToken(token: string, userId: string): Promise<PasswordResetTokenEntity | null>;
  abstract findPasswordResetTokenByUserId(userId: string): Promise<PasswordResetTokenEntity | null>;
  abstract savePasswordResetToken(resetToken: PasswordResetTokenEntity): Promise<PasswordResetTokenEntity>;
  abstract invalidateUserPasswordResetTokens(userId: string): Promise<void>;
  abstract deleteExpiredPasswordResetTokens(): Promise<void>;
}
