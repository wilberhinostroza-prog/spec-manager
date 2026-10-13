import localforage from 'localforage'
import { type AppData, SCHEMA_VERSION } from '../types/schema'

const STORE_NAME = 'spec-manager-data'

// IndexedDB con fallback automático a localStorage (plan.md, riesgo R1)
const store = localforage.createInstance({
  name: 'spec-manager',
  storeName: 'kv',
  description: 'Datos locales de Spec Manager',
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE]
})

function emptyData(): AppData {
  return { schemaVersion: SCHEMA_VERSION, proyectos: [] }
}

/** Carga los datos; si no existen, crea y persiste el objeto raíz. */
export async function load(): Promise<AppData> {
  const data = await store.getItem<AppData>(STORE_NAME)
  if (data && typeof data === 'object' && 'proyectos' in data) {
    return data
  }
  const fresh = emptyData()
  await store.setItem(STORE_NAME, fresh)
  return fresh
}

/** Persiste todo el objeto raíz. Volumen pequeño (KB): reescritura completa. */
export async function save(data: AppData): Promise<void> {
  await store.setItem(STORE_NAME, data)
}

/** Alias semántico: garantiza que exista el objeto raíz antes de usar la app. */
export async function init(): Promise<AppData> {
  return load()
}