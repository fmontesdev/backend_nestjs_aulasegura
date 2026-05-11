import { FindReadersFiltersDto } from '../../application/dto/find-readers-filters.dto';

type ParsedFilters = Partial<Omit<FindReadersFiltersDto, 'page' | 'limit'>>;

const booleanMapping: Record<string, boolean> = {
  true: true,
  false: false,
  activo: true,
  inactivo: false,
  active: true,
  inactive: false,
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
      case 'code':
      case 'codigo':
      case 'código':
        parsed.code = value;
        break;
      case 'room':
      case 'aula':
        parsed.room = value;
        break;
      case 'active':
      case 'activo':
      case 'status':
      case 'estado':
        if (booleanMapping[normalizedValue] !== undefined) {
          parsed.isActive = booleanMapping[normalizedValue];
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
