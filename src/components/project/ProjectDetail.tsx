import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProjectsStore } from '../../stores/useProjectsStore'
import { ProjectHeader } from './ProjectHeader'
import { Tabs, type TabId } from './Tabs'
import { ResumenTab } from './ResumenTab'
import { ReqsTab } from './ReqsTab'

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const cargado = useProjectsStore(s => s.cargado)
  const loadProjects = useProjectsStore(s => s.loadProjects)
  const proyecto = useProjectsStore(s => s.proyectos.find(p => p.id === id))
  const [tab, setTab] = useState<TabId>('resumen')

  if (!cargado) {
    loadProjects()
  }

  if (cargado && !proyecto) {
    return (
      <div className="page">
        <main>
          <Link to="/" className="btn">← Volver</Link>
          <div className="empty-state">
            <p>Proyecto no encontrado.</p>
          </div>
        </main>
      </div>
    )
  }

  if (!proyecto) return null

  return (
    <div className="page">
      <ProjectHeader proyecto={proyecto} />
      <Tabs activa={tab} onChange={setTab} />
      <main className="tab-content">
        {tab === 'resumen' && <ResumenTab proyecto={proyecto} />}
        {tab === 'requerimientos' && <ReqsTab proyecto={proyecto} />}
        {tab === 'historias' && (
          <div className="empty-state">
            <p className="muted">Historias en construcción (Fase 5).</p>
          </div>
        )}
      </main>
    </div>
  )
}