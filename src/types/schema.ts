// Schema raíz de la app — versionado para migraciones futuras (NFR-05)
export const SCHEMA_VERSION = 1

export interface AppData {
  schemaVersion: number
  proyectos: import('./proyecto').Project[]
}