import type { Project, Seccion, SeccionTipo } from '../types/proyecto'
import { uuid } from './uuid'

interface SeccionDefault {
  tipo: SeccionTipo
  titulo: string
}

/** Las 7 secciones que todo proyecto nuevo tiene al crearse (FR-08). */
const SECCIONES_DEFAULT: SeccionDefault[] = [
  { tipo: 'vision', titulo: 'vision: qué problema resuelve, en 2-3 líneas' },
  { tipo: 'objetivos', titulo: 'objetivos: Qué hara la app' },
  { tipo: 'no_objetivos', titulo: 'no objetivos: qué NO hará la app — esto evita scope creep' },
  { tipo: 'requerimientos', titulo: 'funcionales: (lista numerada, verbos claros), NO funcionales (rendimiento, seguridad, idiomas, offline, etc.)' },
  { tipo: 'modelo_datos', titulo: 'modelo de datos: entidades, campos, relaciones' },
  { tipo: 'criterios', titulo: 'Criterios de aceptación: (cómo sabré que está terminado y correcto)' },
  { tipo: 'fuera_alcance', titulo: 'Fuera de alcance: / Supuestos / Riesgos' }
]

export interface NewProjectInput {
  nombre: string
  descripcion?: string
  frontend?: string
  backend?: string
  db?: string
}

export function createProject(input: NewProjectInput): Project {
  const ahora = new Date().toISOString()
  const secciones: Seccion[] = SECCIONES_DEFAULT.map(s => ({
    id: uuid(),
    tipo: s.tipo,
    titulo: s.titulo,
    contenido: ''
  }))

  return {
    id: uuid(),
    nombre: input.nombre.trim(),
    descripcion: input.descripcion?.trim() ?? '',
    stack: {
      frontend: input.frontend?.trim() ?? '',
      backend: input.backend?.trim() ?? '',
      db: input.db?.trim() ?? ''
    },
    secciones,
    requerimientos: [],
    historias: [],
    creadoEn: ahora,
    actualizadoEn: ahora
  }
}