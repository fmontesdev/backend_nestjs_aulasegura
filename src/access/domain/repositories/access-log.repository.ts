import { AccessLogEntity } from '../entities/access-log.entity';
import { AccessAnalyticsDateFilter, AccessAnalyticsSummaryDto } from '../../application/dto/access-analytics-summary.dto';
import { FindAccessLogFiltersDto, PaginatedResult } from '../../application/dto/find-access-log-filters.dto';

export abstract class AccessLogRepository {
  abstract findAll(filters: FindAccessLogFiltersDto): Promise<PaginatedResult<AccessLogEntity>>;
  abstract getAnalyticsSummary(dateFilter: AccessAnalyticsDateFilter, limit: number): Promise<AccessAnalyticsSummaryDto>;
  abstract findOneById(accessLogId: number): Promise<AccessLogEntity | null>;
  abstract save(accessLog: AccessLogEntity): Promise<AccessLogEntity>;
}
