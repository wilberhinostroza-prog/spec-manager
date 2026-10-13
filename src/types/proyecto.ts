export interface Stack {
  frontend: string
  backend: string
  db: string
}

export type SeccionTipo =
  | 'vision'
  | 'objetivos'
  | 'no_objetivos'
  | 'requerimientos'
  | 'modelo_datos'
  | 'criterios'
  | 'fuera_alcance'

export interface Seccion {
  id: string
  tipo: SeccionTipo
  titulo: string
  contenido: string // Markdown libre
}

export interface Criterio {
  id: string
  descripcion: string
  cumplido: boolean
}

export interface Requerimiento {
  id: string
  codigo: string // REQ-01, REQ-02...
  titulo: string
  descripcion: string
  tipo: 'funcional' | 'no_funcional'
  prioridad: 'alta' | 'media' | 'baja'
  estado: 'borrador' | 'aprobado' | 'implementado' | 'verificado'
  criterios: Criterio[]
}

export interface Historia {
  id: string
  como: string
  quiero: string
  para: string
  criterios: Criterio[]
}

export interface Project {
  id: string
  nombre: string
  descripcion: string
  stack: Stack
  secciones: Seccion[]
  requerimientos: Requerimiento[]
  historias: Historia[]
  creadoEn: string // ISO-8601
  actualizadoEn: string // ISO-8601
}