import { describe, it, expect, beforeEach } from 'vitest'
import { load, save, init } from '../services/storage'
import { SCHEMA_VERSION } from '../types/schema'

// En jsdom no hay IndexedDB: localforage cae a localStorage (fallback planeado)
beforeEach(() => {
  localStorage.clear()
})

describe('storage', () => {
  it('init en estado vacío crea el objeto raíz correcto', async () => {
    const data = await init()
    expect(data).toEqual({ schemaVersion: SCHEMA_VERSION, proyectos: [] })
  })

  it('save → load hace round-trip de los datos', async () => {
    const data = await init()
    data.proyectos.push({
      id: 'p1',
      nombre: 'Test',
      descripcion: '',
      stack: { frontend: '', backend: '', db: '' },
      secciones: [],
      requerimientos: [],
      historias: [],
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    })
    await save(data)

    const cargado = await load()
    expect(cargado.proyectos).toHaveLength(1)
    expect(cargado.proyectos[0].nombre).toBe('Test')
    expect(cargado.schemaVersion).toBe(SCHEMA_VERSION)
  })

  it('load devuelve los datos persistidos entre llamadas', async () => {
    await init()
    const data = await load()
    data.proyectos = []
    await save(data)
    const otra = await load()
    expect(otra.proyectos).toHaveLength(0)
  })
})