import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { AccessAnalyticsDateFilter } from '../../../application/dto/access-analytics-summary.dto';

export class GetAccessAnalyticsSummaryQueryRequest {
  @ApiPropertyOptional({
    description: 'Rango de fecha para calcular las analíticas',
    enum: AccessAnalyticsDateFilter,
    default: AccessAnalyticsDateFilter.TODAY,
  })
  @IsEnum(AccessAnalyticsDateFilter)
  @IsOptional()
  date?: AccessAnalyticsDateFilter = AccessAnalyticsDateFilter.TODAY;

  @ApiPropertyOptional({
    description: 'Número máximo de elementos en rankings',
    default: 5,
    minimum: 1,
    maximum: 50,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 5;
}
