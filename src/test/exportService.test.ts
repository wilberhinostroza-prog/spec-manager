import { describe, it, expect } from 'vitest'
import { exportJSON, exportMarkdown } from '../services/exportService'
import { validateImport } from '../services/schema'
import { SCHEMA_VERSION } from '../types/schema'
import type { Project } from '../types/proyecto'

function proyectoEjemplo(): Project {
  return {
    id: 'p-1',
    nombre: 'Sistema de inventario',
    descripcion: 'Control de stock',
    stack: { frontend: 'React', backend: 'FastAPI', db: 'SQLite' },
    secciones: [{ id: 's1', tipo: 'vision', titulo: 'Visión', contenido: 'Texto' }],
    requerimientos: [{
      id: 'r1', codigo: 'REQ-01', titulo: 'Registrar productos',
      descripcion: 'Con nombre, SKU y stock',
      tipo: 'funcional', prioridad: 'alta', estado: 'verificado',
      criterios: [{ id: 'c1', descripcion: 'Valida SKU único', cumplido: true }]
    }],
    historias: [{
      id: 'h1', como: 'desarrollador', quiero: 'exportar a Markdown', para: 'dárselo a mi IA',
      criterios: []
    }],
    creadoEn: '2026-10-17T00:00:00.000Z',
    actualizadoEn: '2026-10-17T00:00:00.000Z'
  }
}

describe('exportJSON', () => {
  it('genera JSON con schemaVersion correcto (NFR-05)', () => {
    const obj = JSON.parse(exportJSON(proyectoEjemplo()))
    expect(obj.schemaVersion).toBe(SCHEMA_VERSION)
    expect(obj.proyectos).toHaveLength(1)
  })

  it('round-trip: lo exportado pasa la validación y recrea el proyecto idéntico (AC-03)', () => {
    const original = proyectoEjemplo()
    const json = exportJSON(original)
    const result = validateImport(JSON.parse(json))
    expect(result.ok).toBe(true)
    expect(result.data?.proyectos[0]).toEqual(original)
  })
})

describe('exportMarkdown', () => {
  it('incluye nombre, stack, REQ con código/prioridad/estado y criterios (AC-05)', () => {
    const md = exportMarkdown(proyectoEjemplo())
    expect(md).toContain('# Spec: Sistema de inventario')
    expect(md).toContain('React / FastAPI / SQLite')
    expect(md).toContain('**REQ-01** (alta, verificado): Registrar productos')
    expect(md).toContain('[x] Valida SKU único')
    expect(md).toContain('Como desarrollador quiero exportar a Markdown para dárselo a mi IA.')
  })

  it('no incluye línea de stack si está vacío', () => {
    const p = proyectoEjemplo()
    p.stack = { frontend: '', backend: '', db: '' }
    expect(exportMarkdown(p)).not.toContain('**Stack:**')
  })
})