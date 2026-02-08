import { FindSubjectsFiltersDto } from '../../application/dto/find-subjects-filters.dto';

/**
 * Parsea el string de filtros desde la query string hacia un objeto tipado.
 * 
 * Formato esperado: "término1,término2,campo:valor"
 * - Términos sin ':' → búsqueda global o reconocimiento de términos específicos (activo/inactivo)
 * - Términos con ':' → filtros específicos de campo
 * 
 * Términos reconocidos en español:
 * - activo/active → isActive: true
 * - inactivo/inactive → isActive: false
 * 
 * Filtros específicos soportados:
 * - code:valor → subjectCode
 * - name:valor → name
 * - status:activo/inactivo → isActive
 * - department:valor → department.name
 * - course:valor → course.courseCode (busca en el código de curso de la relación ManyToMany)
 * 
 * @param filtersString - String con los filtros separados por comas
 * @returns Objeto con los filtros parseados y tipados
 */
export function parseFiltersString(filtersString: string): Partial<FindSubjectsFiltersDto> {
  if (!filtersString || filtersString.trim() === '') {
    return {};
  }

  const filters: Partial<FindSubjectsFiltersDto> = {
    globalSearch: [],
  };

  // Mapeo de términos de estado en español/inglés a valores booleanos
  const stateMapping: Record<string, boolean> = {
    activo: true,
    active: true,
    inactivo: false,
    inactive: false,
  };

  // Dividir el string por comas y procesar cada término
  const terms = filtersString.split(',').map(t => t.trim()).filter(t => t !== '');

  for (const term of terms) {
    // Si el término contiene ':', es un filtro específico
    if (term.includes(':')) {
      const [field, ...valueParts] = term.split(':');
      const value = valueParts.join(':').trim(); // Recomponer el valor en caso de múltiples ':'

      if (!value) continue;

      const fieldLower = field.toLowerCase();

      switch (fieldLower) {
        case 'code':
        case 'subjectcode':
        case 'codigo':
          filters.subjectCode = value;
          break;
        case 'name':
        case 'nombre':
          filters.name = value;
          break;
        case 'status':
        case 'estado':
        case 'estate':
          const mappedState = stateMapping[value.toLowerCase()];
          if (mappedState !== undefined) {
            filters.isActive = mappedState;
          }
          break;
        case 'department':
        case 'departamento':
          filters.departmentName = value;
          break;
        case 'course':
        case 'curso':
          filters.courseCode = value;
          break;
        default:
          // Campo no reconocido, se ignora
          break;
      }
    } else {
      // Término sin ':', puede ser un término de estado reconocido o búsqueda global
      const termLower = term.toLowerCase();
      
      // Verifica si es un término de estado reconocido
      const mappedState = stateMapping[termLower];
      if (mappedState !== undefined) {
        filters.isActive = mappedState;
      } else {
        // No es un término reconocido, agregar a búsqueda global
        filters.globalSearch!.push(term);
      }
    }
  }

  return filters;
}
