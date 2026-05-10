import { AccessLogEntity } from '../entities/access-log.entity';
import { FindAccessLogFiltersDto, PaginatedResult } from '../../application/dto/find-access-log-filters.dto';

export abstract class AccessLogRepository {
  abstract findAll(filters: FindAccessLogFiltersDto): Promise<PaginatedResult<AccessLogEntity>>;
  abstract findOneById(accessLogId: number): Promise<AccessLogEntity | null>;
  abstract save(accessLog: AccessLogEntity): Promise<AccessLogEntity>;
}
