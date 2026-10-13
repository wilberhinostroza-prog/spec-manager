import { describe, it, expect } from 'vitest'
import { validateImport } from '../services/schema'
import { SCHEMA_VERSION } from '../types/schema'

function proyectoValido(nombre = 'Proyecto X') {
  return {
    id: 'uuid-1',
    nombre,
    descripcion: '',
    stack: { frontend: '', backend: '', db: '' },
    secciones: [
      { id: 's1', tipo: 'vision', titulo: 'Visión', contenido: '' }
    ],
    requerimientos: [],
    historias: [],
    creadoEn: '2026-10-11T00:00:00.000Z',
    actualizadoEn: '2026-10-11T00:00:00.000Z'
  }
}

describe('validateImport', () => {
  it('acepta un JSON válido con schemaVersion correcto', () => {
    const r = validateImport({ schemaVersion: SCHEMA_VERSION, proyectos: [proyectoValido()] })
    expect(r.ok).toBe(true)
    expect(r.errors).toHaveLength(0)
    expect(r.data?.proyectos[0].nombre).toBe('Proyecto X')
  })

  it('rechaza JSON que no es un objeto (corrupto)', () => {
    expect(validateImport('texto').ok).toBe(false)
    expect(validateImport(null).ok).toBe(false)
    expect(validateImport(42).ok).toBe(false)
  })

  it('rechaza schemaVersion mayor con mensaje claro', () => {
    const r = validateImport({ schemaVersion: SCHEMA_VERSION + 1, proyectos: [proyectoValido()] })
    expect(r.ok).toBe(false)
    expect(r.errors[0]).toMatch(/no soportada/)
  })

  it('rechaza proyecto sin nombre', () => {
    const p = proyectoValido()
    p.nombre = ''
    const r = validateImport({ schemaVersion: SCHEMA_VERSION, proyectos: [p] })
    expect(r.ok).toBe(false)
    expect(r.errors[0]).toMatch(/incompleto/)
  })

  it('rechaza falta del array proyectos', () => {
    const r = validateImport({ schemaVersion: SCHEMA_VERSION })
    expect(r.ok).toBe(false)
    expect(r.errors[0]).toMatch(/"proyectos"/)
  })

  it('rechaza sección con tipo inválido', () => {
    const p = proyectoValido()
    p.secciones = [{ id: 's1', tipo: 'inventado', titulo: 'X', contenido: '' }]
    const r = validateImport({ schemaVersion: SCHEMA_VERSION, proyectos: [p] })
    expect(r.ok).toBe(false)
    expect(r.errors[0]).toMatch(/tipo inválido/)
  })
})