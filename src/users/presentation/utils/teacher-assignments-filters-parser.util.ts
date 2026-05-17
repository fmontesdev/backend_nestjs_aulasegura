import { FindTeacherAssignmentsFiltersDto } from '../../application/dto/find-teacher-assignments-filters.dto';

export type ParsedTeacherAssignmentFilters = Omit<FindTeacherAssignmentsFiltersDto, 'page' | 'limit'>;

const activeMapping: Record<string, boolean> = {
  true: true,
  activo: true,
  active: true,
  false: false,
  inactivo: false,
  inactive: false,
};

export function parseTeacherAssignmentsFiltersString(filtersString: string): ParsedTeacherAssignmentFilters {
  if (!filtersString || filtersString.trim() === '') {
    return {};
  }

  const parsed: ParsedTeacherAssignmentFilters = { globalSearch: [] };
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
      case 'teacherid':
      case 'teacher_id':
      case 'profesorid':
      case 'profesor_id':
        parsed.teacherId = value;
        break;
      case 'teacher':
      case 'profesor':
        parsed.teacher = value;
        break;
      case 'email':
        parsed.email = value;
        break;
      case 'course':
      case 'curso':
        parsed.course = value;
        if (isIntegerString(value)) {
          parsed.courseId = Number(value);
        }
        break;
      case 'subject':
      case 'asignatura':
        parsed.subject = value;
        if (isIntegerString(value)) {
          parsed.subjectId = Number(value);
        }
        break;
      case 'active':
      case 'estado':
        if (value.toLowerCase() in activeMapping) {
          parsed.isActive = activeMapping[value.toLowerCase()];
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

function isIntegerString(value: string): boolean {
  return /^\d+$/.test(value.trim());
}
