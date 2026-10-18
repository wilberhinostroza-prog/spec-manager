import { create } from 'zustand'
import type { Historia, Project, Requerimiento } from '../types/proyecto'
import type { AppData } from '../types/schema'
import * as storage from '../services/storage'
import { createProject } from '../services/proyectoFactory'
import type { NewProjectInput } from '../services/proyectoFactory'
import { nextReqCode } from '../services/reqCode'
import { uuid } from '../services/uuid'

/** FR-02: Home ordena por última modificación, más reciente primero. */
function ordenados(proyectos: Project[]): Project[] {
  return [...proyectos].sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn))
}

/** Carga → muta → guarda → devuelve la lista ordenada (plan.md sección 2). */
async function mutateStore(fn: (data: AppData) => void): Promise<Project[]> {
  const data = await storage.load()
  fn(data)
  await storage.save(data)
  return ordenados(data.proyectos)
}

function findProject(data: AppData, id: string): Project | undefined {
  return data.proyectos.find(p => p.id === id)
}

export type NewRequerimientoInput = {
  titulo: string
  descripcion?: string
  tipo: Requerimiento['tipo']
  prioridad: Requerimiento['prioridad']
  estado: Requerimiento['estado']
}

export type HistoriaCriterioInput = {
  id?: string
  descripcion: string
  cumplido: boolean
}

export type NewHistoriaInput = {
  como: string
  quiero: string
  para: string
  criterios: HistoriaCriterioInput[]
}

interface ProjectsState {
  proyectos: Project[]
  cargado: boolean
  loadProjects: () => Promise<void>
  addProject: (input: NewProjectInput) => Promise<Project>
  updateProject: (id: string, patch: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  importProjects: (nuevos: Project[]) => Promise<void>
  // --- Requerimientos (Fase 4) ---
  addRequerimiento: (proyectoId: string, input: NewRequerimientoInput) => Promise<void>
  updateRequerimiento: (proyectoId: string, reqId: string, patch: Partial<Requerimiento>) => Promise<void>
  deleteRequerimiento: (proyectoId: string, reqId: string) => Promise<void>
  addCriterio: (proyectoId: string, reqId: string, descripcion: string) => Promise<void>
  toggleCriterio: (proyectoId: string, reqId: string, criterioId: string) => Promise<void>
  deleteCriterio: (proyectoId: string, reqId: string, criterioId: string) => Promise<void>
  // --- Historias (T39) ---
  addHistoria: (proyectoId: string, input: NewHistoriaInput) => Promise<void>
  updateHistoria: (proyectoId: string, historiaId: string, patch: Partial<Historia>) => Promise<void>
  deleteHistoria: (proyectoId: string, historiaId: string) => Promise<void>
  addHistoriaCriterio: (proyectoId: string, historiaId: string, descripcion: string) => Promise<void>
  toggleHistoriaCriterio: (proyectoId: string, historiaId: string, criterioId: string) => Promise<void>
  deleteHistoriaCriterio: (proyectoId: string, historiaId: string, criterioId: string) => Promise<void>
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  proyectos: [],
  cargado: false,

  loadProjects: async () => {
    const data = await storage.load()
    set({ proyectos: ordenados(data.proyectos), cargado: true })
  },

  addProject: async (input) => {
    const proyecto = createProject(input)
    const proyectos = await mutateStore(d => {
      d.proyectos.push(proyecto)
    })
    set({ proyectos })
    return proyecto
  },

  updateProject: async (id, patch) => {
    const proyectos = await mutateStore(d => {
      const p = findProject(d, id)
      if (p) Object.assign(p, patch, { actualizadoEn: new Date().toISOString() })
    })
    set({ proyectos })
  },

  deleteProject: async (id) => {
    const proyectos = await mutateStore(d => {
      d.proyectos = d.proyectos.filter(p => p.id !== id)
    })
    set({ proyectos })
  },

  importProjects: async (nuevos) => {
    const proyectos = await mutateStore(d => {
      d.proyectos.push(...nuevos)
    })
    set({ proyectos })
  },

  // ---------- Requerimientos ----------

  addRequerimiento: async (proyectoId, input) => {
    const proyectos = await mutateStore(d => {
      const p = findProject(d, proyectoId)
      if (!p) return
      p.requerimientos.push({
        id: uuid(),
        codigo: nextReqCode(p.requerimientos), // FR-05
        titulo: input.titulo.trim(),
        descripcion: input.descripcion?.trim() ?? '',
        tipo: input.tipo,
        prioridad: input.prioridad,
        estado: input.estado,
        criterios: []
      })
      p.actualizadoEn = new Date().toISOString()
    })
    set({ proyectos })
  },

  updateRequerimiento: async (proyectoId, reqId, patch) => {
    const proyectos = await mutateStore(d => {
      const p = findProject(d, proyectoId)
      const r = p?.requerimientos.find(x => x.id === reqId)
      if (p && r) {
        Object.assign(r, patch)
        p.actualizadoEn = new Date().toISOString()
      }
    })
    set({ proyectos })
  },

  deleteRequerimiento: async (proyectoId, reqId) => {
    const proyectos = await mutateStore(d => {
      const p = findProject(d, proyectoId)
      if (p) {
        p.requerimientos = p.requerimientos.filter(r => r.id !== reqId)
        p.actualizadoEn = new Date().toISOString()
      }
    })
    set({ proyectos })
  },

  addCriterio: async (proyectoId, reqId, descripcion) => {
    const proyectos = await mutateStore(d => {
      const r = findProject(d, proyectoId)?.requerimientos.find(x => x.id === reqId)
      if (r && descripcion.trim() !== '') {
        r.criterios.push({ id: uuid(), descripcion: descripcion.trim(), cumplido: false })
      }
    })
    set({ proyectos })
  },

  toggleCriterio: async (proyectoId, reqId, criterioId) => {
    const proyectos = await mutateStore(d => {
      const r = findProject(d, proyectoId)?.requerimientos.find(x => x.id === reqId)
      const c = r?.criterios.find(x => x.id === criterioId)
      if (c) c.cumplido = !c.cumplido
    })
    set({ proyectos })
  },

  deleteCriterio: async (proyectoId, reqId, criterioId) => {
    const proyectos = await mutateStore(d => {
      const r = findProject(d, proyectoId)?.requerimientos.find(x => x.id === reqId)
      if (r) r.criterios = r.criterios.filter(c => c.id !== criterioId)
    })
    set({ proyectos })
  },

  // ---------- Historias ----------

  addHistoria: async (proyectoId, input) => {
    const proyectos = await mutateStore(d => {
      const p = findProject(d, proyectoId)
      if (!p) return
      p.historias.push({
        id: uuid(),
        como: input.como.trim(),
        quiero: input.quiero.trim(),
        para: input.para.trim(),
        criterios: input.criterios
          .filter(c => c.descripcion.trim() !== '')
          .map(c => ({
            id: c.id ?? uuid(),
            descripcion: c.descripcion.trim(),
            cumplido: c.cumplido
          }))
      })
      p.actualizadoEn = new Date().toISOString()
    })
    set({ proyectos })
  },

  updateHistoria: async (proyectoId, historiaId, patch) => {
    const proyectos = await mutateStore(d => {
      const p = findProject(d, proyectoId)
      const h = p?.historias.find(x => x.id === historiaId)
      if (p && h) {
        Object.assign(h, patch)
        p.actualizadoEn = new Date().toISOString()
      }
    })
    set({ proyectos })
  },

  deleteHistoria: async (proyectoId, historiaId) => {
    const proyectos = await mutateStore(d => {
      const p = findProject(d, proyectoId)
      if (p) {
        p.historias = p.historias.filter(h => h.id !== historiaId)
        p.actualizadoEn = new Date().toISOString()
      }
    })
    set({ proyectos })
  },

  addHistoriaCriterio: async (proyectoId, historiaId, descripcion) => {
    const proyectos = await mutateStore(d => {
      const h = findProject(d, proyectoId)?.historias.find(x => x.id === historiaId)
      if (h && descripcion.trim() !== '') {
        h.criterios.push({ id: uuid(), descripcion: descripcion.trim(), cumplido: false })
      }
    })
    set({ proyectos })
  },

  toggleHistoriaCriterio: async (proyectoId, historiaId, criterioId) => {
    const proyectos = await mutateStore(d => {
      const h = findProject(d, proyectoId)?.historias.find(x => x.id === historiaId)
      const c = h?.criterios.find(x => x.id === criterioId)
      if (c) c.cumplido = !c.cumplido
    })
    set({ proyectos })
  },

  deleteHistoriaCriterio: async (proyectoId, historiaId, criterioId) => {
    const proyectos = await mutateStore(d => {
      const h = findProject(d, proyectoId)?.historias.find(x => x.id === historiaId)
      if (h) h.criterios = h.criterios.filter(c => c.id !== criterioId)
    })
    set({ proyectos })
  }
}))