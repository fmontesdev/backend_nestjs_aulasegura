import { FindTagsFiltersDto } from '../../application/dto/find-tags-filters.dto';
import { TagType } from '../../domain/enums/tag-type.enum';

type ParsedFilters = Partial<Omit<FindTagsFiltersDto, 'page' | 'limit'>>;

const booleanMapping: Record<string, boolean> = {
  true: true,
  false: false,
  activo: true,
  inactivo: false,
};

const typeMapping: Record<string, TagType> = {
  [TagType.RFID]: TagType.RFID,
  [TagType.NFC_MOBILE]: TagType.NFC_MOBILE,
};

export function parseFiltersString(filtersString: string): ParsedFilters {
  if (!filtersString || filtersString.trim() === '') {
    return {};
  }

  const parsed: ParsedFilters = { globalSearch: [] };
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
      case 'type':
      case 'tipo':
        if (typeMapping[normalizedValue]) parsed.type = typeMapping[normalizedValue];
        break;
      case 'user':
      case 'usuario':
        parsed.user = value;
        break;
      case 'email':
        parsed.email = value;
        break;
      case 'active':
      case 'estado':
        if (booleanMapping[normalizedValue] !== undefined) parsed.isActive = booleanMapping[normalizedValue];
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
