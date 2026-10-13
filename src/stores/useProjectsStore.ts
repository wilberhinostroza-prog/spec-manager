import { create } from 'zustand'
import type { Project } from '../types/proyecto'
import type { AppData } from '../types/schema'
import * as storage from '../services/storage'
import { createProject } from '../services/proyectoFactory'
import type { NewProjectInput } from '../services/proyectoFactory'

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

interface ProjectsState {
  proyectos: Project[]
  cargado: boolean
  loadProjects: () => Promise<void>
  addProject: (input: NewProjectInput) => Promise<Project>
  updateProject: (id: string, patch: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  importProjects: (nuevos: Project[]) => Promise<void>
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
      const p = d.proyectos.find(x => x.id === id)
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
  }
}))