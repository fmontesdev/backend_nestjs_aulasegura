import { EducationStage } from '../../domain/enums/education-stage.enum';
import { CFLevel } from '../../domain/enums/cf-level.enum';

export interface ParsedFilters {
  globalSearch?: string[];
  courseCode?: string;
  name?: string;
  educationStage?: EducationStage;
  levelNumber?: number;
  cfLevel?: CFLevel;
  isActive?: boolean;
}

/**
 * Parsea la cadena de filtros con formato: activo,stage:eso,nivel:1
 * - Valores sin ":" se consideran búsqueda global o términos reconocidos
 * - Valores con ":" son filtros específicos
 * 
 * Búsqueda global (sin ":"):
 * - Busca en: courseCode, name
 * - Reconoce y mapea términos en español:
 *   * Etapas: eso, bachillerato, cf/ciclos → se convierten en filtros de educationStage
 *   * Niveles: 1, 2, 3, 4 → se convierten en filtros de levelNumber
 *   * CF Levels: cfgm/medio, cfgs/superior, fpb → se convierten en filtros de cfLevel
 *   * Estado: activo, inactivo, active, inactive → se convierten en filtros de isActive
 * 
 * Campos específicos soportados:
 * - code/courseCode/codigo: filtro por código de curso
 * - name/nombre: filtro por nombre de curso
 * - stage/etapa: filtro por etapa educativa (ESO, bachillerato, CF)
 * - level/nivel: filtro por número de nivel (1, 2, 3, 4)
 * - cflevel: filtro por nivel de ciclo formativo (FPB, CFGM, CFGS)
 * - status/estado: filtro por estado (active, inactive)
 */
export function parseFiltersString(filtersString: string): ParsedFilters {
  if (!filtersString || filtersString.trim() === '') {
    return {};
  }

  const parsed: ParsedFilters = {
    globalSearch: [],
  };

  // Mapeo de términos comunes a etapas educativas (para búsqueda global)
  const stageMapping: Record<string, EducationStage> = {
    'eso': EducationStage.ESO,
    'bachillerato': EducationStage.BACHILLERATO,
    'bach': EducationStage.BACHILLERATO,
    'bat': EducationStage.BACHILLERATO,
    'cf': EducationStage.CF,
    'ciclos': EducationStage.CF,
    'ciclos formativos': EducationStage.CF,
  };

  // Mapeo de términos comunes a niveles de CF (para búsqueda global)
  const cfLevelMapping: Record<string, CFLevel> = {
    'fpb': CFLevel.FPB,
    'formación profesional básica': CFLevel.FPB,
    'formacion profesional basica': CFLevel.FPB,
    'formación profesional': CFLevel.FPB,
    'formacion profesional': CFLevel.FPB,
    'cfgm': CFLevel.CFGM,
    'ciclo formativo de grado medio': CFLevel.CFGM,
    'ciclo formativo grado medio': CFLevel.CFGM,
    'ciclo grado medio': CFLevel.CFGM,
    'grado medio': CFLevel.CFGM,
    'medio': CFLevel.CFGM,
    'cfgs': CFLevel.CFGS,
    'ciclo formativo de grado superior': CFLevel.CFGS,
    'ciclo formativo grado superior': CFLevel.CFGS,
    'ciclo grado superior': CFLevel.CFGS,
    'grado superior': CFLevel.CFGS,
    'superior': CFLevel.CFGS,
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
        case 'code':
        case 'coursecode':
        case 'codigo':
          parsed.courseCode = value;
          break;

        case 'name':
        case 'nombre':
          parsed.name = value;
          break;

        case 'stage':
        case 'etapa':
          const mappedStage = stageMapping[value.toLowerCase()];
          if (mappedStage) {
            parsed.educationStage = mappedStage;
          }
          break;

        case 'level':
        case 'nivel':
          const levelNum = parseInt(value, 10);
          if (levelNum >= 1 && levelNum <= 4) {
            parsed.levelNumber = levelNum;
          }
          break;

        case 'cflevel':
        case 'nivelcf':
          const mappedCFLevel = cfLevelMapping[value.toLowerCase()];
          if (mappedCFLevel) {
            parsed.cfLevel = mappedCFLevel;
          }
          break;

        case 'status':
        case 'estado':
        case 'state':
          const mappedState = stateMapping[value.toLowerCase()];
          if (mappedState !== undefined) {
            parsed.isActive = mappedState;
          }
          break;

        default:
          // Filtro no reconocido, lo ignoramos
          break;
      }
    } else {
      // Búsqueda global - detectar si es etapa, nivel, cfLevel, estado o término de búsqueda
      const lowerTerm = part.toLowerCase().trim();

      // Verificar si es una etapa educativa
      const mappedStage = stageMapping[lowerTerm];
      if (mappedStage) {
        parsed.educationStage = mappedStage;
        continue; // No agregar a globalSearch
      }

      // Verificar si es un número de nivel (1-4)
      const numMatch = part.match(/^[1-4]$/);
      if (numMatch) {
        parsed.levelNumber = parseInt(part, 10);
        continue; // No agregar a globalSearch
      }

      // Verificar si es un nivel de CF (verificar antes de stage porque algunos overlapping)
      const mappedCFLevel = cfLevelMapping[lowerTerm];
      if (mappedCFLevel) {
        parsed.cfLevel = mappedCFLevel;
        continue; // No agregar a globalSearch
      }

      // Verificar si es un estado
      const mappedState = stateMapping[lowerTerm];
      if (mappedState !== undefined) {
        parsed.isActive = mappedState;
        continue; // No agregar a globalSearch
      }
      
      // No es ni etapa, ni nivel, ni cfLevel, ni estado, agregarlo a búsqueda global
      parsed.globalSearch!.push(part);
    }
  }

  // Si no hay términos de búsqueda global, eliminar el array vacío
  if (!parsed.globalSearch || parsed.globalSearch.length === 0) {
    delete parsed.globalSearch;
  }

  return parsed;
}
