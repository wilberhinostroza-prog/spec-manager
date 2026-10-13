import type { Project, Seccion, SeccionTipo } from '../types/proyecto'

interface SeccionDefault {
  tipo: SeccionTipo
  titulo: string
}

/** Las 7 secciones que todo proyecto nuevo tiene al crearse (FR-08). */
const SECCIONES_DEFAULT: SeccionDefault[] = [
  { tipo: 'vision', titulo: 'Visión' },
  { tipo: 'objetivos', titulo: 'Objetivos' },
  { tipo: 'no_objetivos', titulo: 'No objetivos' },
  { tipo: 'requerimientos', titulo: 'Requerimientos' },
  { tipo: 'modelo_datos', titulo: 'Modelo de datos' },
  { tipo: 'criterios', titulo: 'Criterios de aceptación' },
  { tipo: 'fuera_alcance', titulo: 'Fuera de alcance' }
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
    id: crypto.randomUUID(),
    tipo: s.tipo,
    titulo: s.titulo,
    contenido: ''
  }))

  return {
    id: crypto.randomUUID(),
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