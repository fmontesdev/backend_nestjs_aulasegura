export interface ParsedFilters {
  globalSearch?: string[];
  name?: string;
  isActive?: boolean;
  subjectCode?: string;
  teacherName?: string;
}

/**
 * Parsea la cadena de filtros con formato: activo,name:ciencias
 * - Valores sin ":" se consideran búsqueda global o términos reconocidos
 * - Valores con ":" son filtros específicos
 * 
 * Búsqueda global (sin ":"):
 * - Busca en: name, subject.subjectCode, teacher.name, teacher.lastname, CONCAT(teacher.name, ' ', teacher.lastname)
 * - Reconoce y mapea términos en español:
 *   * Estado: activo, inactivo, active, inactive → se convierten en filtros de isActive
 * 
 * Campos específicos soportados:
 * - name/nombre: filtro por nombre de departamento
 * - status/estado: filtro por estado (active, inactive)
 * - subject/asignatura: filtro por código de asignatura
 * - teacher/profesor: filtro por nombre, apellido o nombre completo de profesor (name OR lastname OR name+lastname)
 */
export function parseFiltersString(filtersString: string): ParsedFilters {
  if (!filtersString || filtersString.trim() === '') {
    return {};
  }

  const parsed: ParsedFilters = {
    globalSearch: [],
  };

  // Mapeo de términos comunes a estado (para búsqueda global)
  const stateMapping: Record<string, boolean> = {
    'activo': true,
    'active': true,
    'inactivo': false,
    'inactive': false,
  };

  // Dividir por comas
  const parts = filtersString.split(',').map(p => p.trim()).filter(p => p);

  for (const part of parts) {
    if (part.includes(':')) {
      // Filtro específico
      const [key, ...valueParts] = part.split(':');
      const value = valueParts.join(':').trim(); // Por si el valor contiene ":"
      const normalizedKey = key.trim().toLowerCase();

      if (!value) continue;

      switch (normalizedKey) {
        case 'name':
        case 'nombre':
          parsed.name = value;
          break;

        case 'status':
        case 'estado':
        case 'state':
          const mappedState = stateMapping[value.toLowerCase()];
          if (mappedState !== undefined) {
            parsed.isActive = mappedState;
          }
          break;

        case 'subject':
        case 'asignatura':
          parsed.subjectCode = value;
          break;

        case 'teacher':
        case 'profesor':
          parsed.teacherName = value;
          break;

        default:
          // Filtro no reconocido, lo ignoramos
          break;
      }
    } else {
      // Búsqueda global - detectar si es estado o término de búsqueda
      const lowerTerm = part.toLowerCase().trim();

      // Verificar si es un estado
      const mappedState = stateMapping[lowerTerm];
      if (mappedState !== undefined) {
        parsed.isActive = mappedState;
        continue; // No agregar a globalSearch
      }
      
      // No es estado, agregarlo a búsqueda global
      parsed.globalSearch!.push(part);
    }
  }

  return parsed;
}
