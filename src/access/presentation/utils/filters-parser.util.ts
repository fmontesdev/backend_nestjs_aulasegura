import { AccessLogDateFilter, FindAccessLogFiltersDto } from '../../application/dto/find-access-log-filters.dto';
import { AccessMethod } from '../../domain/enums/access-method.enum';
import { AccessStatus } from '../../domain/enums/access-status.enum';

type ParsedFilters = Partial<Omit<FindAccessLogFiltersDto, 'page' | 'limit'>>;

const accessMethodMapping: Record<string, AccessMethod> = {
  [AccessMethod.RFID]: AccessMethod.RFID,
  [AccessMethod.NFC]: AccessMethod.NFC,
  [AccessMethod.QR]: AccessMethod.QR,
};

const accessStatusMapping: Record<string, AccessStatus> = {
  [AccessStatus.ALLOWED]: AccessStatus.ALLOWED,
  [AccessStatus.DENIED]: AccessStatus.DENIED,
  [AccessStatus.EXIT]: AccessStatus.EXIT,
  [AccessStatus.TIMEOUT]: AccessStatus.TIMEOUT,
  permitido: AccessStatus.ALLOWED,
  denegado: AccessStatus.DENIED,
  salida: AccessStatus.EXIT,
  'tiempo agotado': AccessStatus.TIMEOUT,
};

const dateFilterMapping: Record<string, AccessLogDateFilter> = {
  [AccessLogDateFilter.ALL]: AccessLogDateFilter.ALL,
  [AccessLogDateFilter.TODAY]: AccessLogDateFilter.TODAY,
  [AccessLogDateFilter.WEEK]: AccessLogDateFilter.WEEK,
  [AccessLogDateFilter.MONTH]: AccessLogDateFilter.MONTH,
};

export function parseFiltersString(filtersString: string): ParsedFilters {
  if (!filtersString || filtersString.trim() === '') {
    return {};
  }

  const parsed: ParsedFilters = {
    globalSearch: [],
  };
  const parts = filtersString.split(',').map((part) => part.trim()).filter((part) => part);

  for (const part of parts) {
    if (!part.includes(':')) {
      parsed.globalSearch!.push(part);
      continue;
    }

    const [key, ...valueParts] = part.split(':');
    const value = valueParts.join(':').trim();
    const normalizedKey = key.trim().toLowerCase();
    const normalizedValue = value.toLowerCase();

    if (!value) continue;

    switch (normalizedKey) {
      case 'usuario':
      case 'user':
        parsed.user = value;
        break;
      case 'tipo':
      case 'type':
        if (accessMethodMapping[normalizedValue]) {
          parsed.accessMethod = accessMethodMapping[normalizedValue];
        }
        break;
      case 'fecha':
      case 'date':
        if (dateFilterMapping[normalizedValue]) {
          parsed.dateFilter = dateFilterMapping[normalizedValue];
        }
        break;
      case 'aula':
      case 'room':
        parsed.room = value;
        break;
      case 'status':
      case 'estado':
        if (accessStatusMapping[normalizedValue]) {
          parsed.accessStatus = accessStatusMapping[normalizedValue];
        }
        break;
      default:
        break;
    }
  }

  if (!parsed.globalSearch || parsed.globalSearch.length === 0) {
    delete parsed.globalSearch;
  }

  return parsed;
}
