import { type AppData, SCHEMA_VERSION } from '../types/schema'
import type { Project } from '../types/proyecto'

export interface ValidationResult {
  ok: boolean
  errors: string[]
  data?: AppData
}

const SECCIONES_VALIDAS = [
  'vision', 'objetivos', 'no_objetivos', 'requerimientos',
  'modelo_datos', 'criterios', 'fuera_alcance'
]

function isProject(p: unknown): p is Project {
  if (typeof p !== 'object' || p === null) return false
  const o = p as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.nombre === 'string' && o.nombre.trim() !== '' &&
    Array.isArray(o.secciones) &&
    Array.isArray(o.requerimientos) &&
    Array.isArray(o.historias)
  )
}

/**
 * Valida un archivo JSON importado ANTES de tocar los datos existentes (FR-11).
 * Rechaza: JSON inválido, schemaVersion distinto (mayor o menor), proyectos mal formados.
 */
export function validateImport(raw: unknown): ValidationResult {
  const errors: string[] = []

  // 1. Debe ser un objeto parseable
  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, errors: ['El archivo no contiene un objeto JSON válido.'] }
  }

  const data = raw as Partial<AppData>

  // 2. Versión del schema (NFR-05): solo la versión exacta soportada
  if (data.schemaVersion !== SCHEMA_VERSION) {
    errors.push(
      `schemaVersion ${String(data.schemaVersion)} no soportada ` +
      `(la app soporta la versión ${SCHEMA_VERSION}). Actualiza la app.`
    )
  }

  // 3. Debe traer el array de proyectos
  if (!Array.isArray(data.proyectos)) {
    errors.push('Falta el campo "proyectos" (debe ser un array).')
  } else {
    data.proyectos.forEach((p, i) => {
      if (!isProject(p)) {
        const nombre = (p as Record<string, unknown>)?.nombre
        errors.push(
          `Proyecto #${i + 1}${typeof nombre === 'string' ? ` ("${nombre}")` : ''} ` +
          'está incompleto: requiere id, nombre no vacío, y arrays secciones/requerimientos/historias.'
        )
      } else {
        // 4. Secciones con tipo válido
        p.secciones.forEach((s, j) => {
          if (!SECCIONES_VALIDAS.includes(s.tipo)) {
            errors.push(`Proyecto "${p.nombre}": sección #${j + 1} con tipo inválido "${s.tipo}".`)
          }
        })
      }
    })
  }

  return errors.length === 0
    ? { ok: true, errors: [], data: data as AppData }
    : { ok: false, errors }
}