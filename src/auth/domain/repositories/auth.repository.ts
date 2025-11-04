import { BlacklistTokenEntity } from '../entities/blacklist-token.entity';

export abstract class AuthRepository {
  abstract saveBlacklistToken(blacklistToken: BlacklistTokenEntity): Promise<BlacklistTokenEntity>;
  abstract isTokenBlacklisted(token: string): Promise<boolean>;
  abstract deleteExpiredBlacklistTokens(): Promise<void>;
}
