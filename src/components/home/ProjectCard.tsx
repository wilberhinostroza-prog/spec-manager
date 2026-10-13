import { Link } from 'react-router-dom'
import type { Project } from '../../types/proyecto'

const fmtFecha = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit', month: 'short', year: 'numeric'
})

export function ProjectCard({ proyecto }: { proyecto: Project }) {
  return (
    <Link to={`/proyecto/${proyecto.id}`} className="card project-card">
      <h3>{proyecto.nombre}</h3>
      {proyecto.descripcion && <p className="muted">{proyecto.descripcion}</p>}
      <div className="card-meta">
        <span>{proyecto.requerimientos.length} requerimiento(s)</span>
        <span>{fmtFecha.format(new Date(proyecto.actualizadoEn))}</span>
      </div>
    </Link>
  )
}