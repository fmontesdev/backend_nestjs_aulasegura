import { AccessLogEntity } from '../entities/access-log.entity';

export abstract class AccessLogRepository {
  abstract findAll(): Promise<AccessLogEntity[]>;
  abstract findOneById(accessLogId: number): Promise<AccessLogEntity | null>;
  abstract save(accessLog: AccessLogEntity): Promise<AccessLogEntity>;
}
