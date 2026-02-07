import { RoleName } from '../../domain/enums/rolename.enum';
import { UserState } from '../../application/dto/find-users-filters.dto';

export interface ParsedFilters {
  globalSearch?: string[];
  fullName?: string;
  email?: string;
  roles?: RoleName[];
  departmentName?: string;
  state?: UserState;
}

/**
 * Parsea la cadena de filtros con formato: paco,rol:admin,status:active
 * - Valores sin ":" se consideran búsqueda global (busca en: nombre, apellido, email, roles)
 * - Valores con ":" son filtros específicos
 * 
 * Búsqueda global (sin ":"):
 * - Busca en: name, lastname, fullName, email y departamento
 * - Reconoce y mapea términos en español:
 *   * Roles: administrador, profesor, conserje, personal → se convierten en filtros de rol
 *   * Estado: activo, inactivo, active, inactive → se convierten en filtros de estado
 * 
 * Campos específicos soportados:
 * - fullName: búsqueda por nombre completo
 * - email: búsqueda por email
 * - rol o role: filtro por rol (admin, teacher, janitor, support_staff)
 * - status o state: filtro por estado (active, inactive)
 * - department o departamento: filtro por nombre de departamento
 */
export function parseFiltersString(filtersString: string): ParsedFilters {
  if (!filtersString || filtersString.trim() === '') {
    return {};
  }

  const parsed: ParsedFilters = {
    globalSearch: [],
  };

  // Mapeo de términos comunes a roles (para búsqueda global)
  const roleMapping: Record<string, RoleName> = {
    'administrador': RoleName.ADMIN,
    'admin': RoleName.ADMIN,
    'administrator': RoleName.ADMIN,
    'profesor': RoleName.TEACHER,
    'teacher': RoleName.TEACHER,
    'maestro': RoleName.TEACHER,
    'docente': RoleName.TEACHER,
    'conserje': RoleName.JANITOR,
    'janitor': RoleName.JANITOR,
    'portero': RoleName.JANITOR,
    'staff': RoleName.SUPPORT_STAFF,
    'personal': RoleName.SUPPORT_STAFF,
    'support': RoleName.SUPPORT_STAFF,
    'soporte': RoleName.SUPPORT_STAFF,
    'apoyo': RoleName.SUPPORT_STAFF
  };

  // Mapeo de términos comunes a estado del usuario (para búsqueda global)
  const stateMapping: Record<string, UserState> = {
    'activo': UserState.ACTIVE,
    'active': UserState.ACTIVE,
    'inactivo': UserState.INACTIVE,
    'inactive': UserState.INACTIVE,
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
        case 'fullname':
        case 'name':
        case 'nombre':
          parsed.fullName = value;
          break;

        case 'email':
        case 'correo':
          parsed.email = value;
          break;

        case 'rol':
        case 'role':
          // Puede ser múltiples roles separados por pipe: rol:admin|teacher
          const roleValues = value.split('|').map(r => r.trim().toUpperCase());
          const validRoles: RoleName[] = [];
          
          for (const roleStr of roleValues) {
            // Verificar si es un rol
            const mappedRole = roleMapping[roleStr.toLowerCase()];
            if (mappedRole && !validRoles.includes(mappedRole)) {
              validRoles.push(mappedRole);
            }
          }

          if (validRoles.length > 0) {
            parsed.roles = validRoles;
          }
          break;

        case 'status':
        case 'state':
        case 'estado':
          const mappedState = stateMapping[value.toLowerCase()];

          if (mappedState) {
            parsed.state = mappedState;
          }
          break;

        case 'department':
        case 'departmentname':
        case 'departamento':
          parsed.departmentName = value;
          break;

        default:
          // Filtro no reconocido, lo ignoramos
          break;
      }
    } else {
      // Búsqueda global - detectar si es rol, estado o término de búsqueda
      const lowerTerm = part.toLowerCase().trim();
      
      // Verificar si es un rol
      const mappedRole = roleMapping[lowerTerm];
      if (mappedRole) {
        // Es un término de rol, agregarlo a roles específicos
        if (!parsed.roles) {
          parsed.roles = [];
        }
        if (!parsed.roles.includes(mappedRole)) {
          parsed.roles.push(mappedRole);
        }
        continue; // No agregar a globalSearch
      }
      
      // Verificar si es un estado
      const mappedState = stateMapping[lowerTerm];
      if (mappedState !== undefined) {
        parsed.state = mappedState;
        continue; // No agregar a globalSearch
      }
      
      // No es ni rol ni estado, agregarlo a búsqueda global
      parsed.globalSearch!.push(part);
    }
  }

  // Si no hay términos de búsqueda global, eliminar el array vacío
  if (!parsed.globalSearch || parsed.globalSearch.length === 0) {
    delete parsed.globalSearch;
  }

  return parsed;
}
