import { FindRoomsFiltersDto } from '../../application/dto/find-rooms-filters.dto';

type ParsedFilters = Partial<Omit<FindRoomsFiltersDto, 'page' | 'limit'>>;

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

    if (!value) continue;

      switch (normalizedKey) {
      case 'name':
      case 'nombre':
        parsed.name = value;
        break;
      case 'building':
      case 'edificio':
        parsed.building = parseNumber(value);
        break;
      case 'floor':
      case 'planta':
      case 'piso':
        parsed.floor = parseNumber(value);
        break;
      case 'course':
      case 'curso':
        parsed.course = value;
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

function parseNumber(value: string): number | undefined {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
}
