import { useProjectsStore } from '../../stores/useProjectsStore'
import { ProjectCard } from './ProjectCard'

export function ProjectList() {
  const proyectos = useProjectsStore(s => s.proyectos)

  if (proyectos.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay proyectos todavía.</p>
        <p className="muted">Crea tu primer proyecto con el botón de arriba.</p>
      </div>
    )
  }

  return (
    <div className="project-list">
      {proyectos.map(p => <ProjectCard key={p.id} proyecto={p} />)}
    </div>
  )
}