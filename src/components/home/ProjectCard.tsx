import { Link, useNavigate } from 'react-router-dom'
import type { MouseEvent } from 'react'
import type { Project } from '../../types/proyecto'
import { useProjectsStore } from '../../stores/useProjectsStore'

const fmtFecha = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit', month: 'short', year: 'numeric'
})

export function ProjectCard({ proyecto }: { proyecto: Project }) {
  const duplicateProject = useProjectsStore(s => s.duplicateProject)
  const navigate = useNavigate()

  const onDuplicar = async (e: MouseEvent) => {
    e.preventDefault()   // evita que el Link navegue
    e.stopPropagation()
    const copia = await duplicateProject(proyecto.id)
    if (copia) navigate(`/proyecto/${copia.id}`)  // te lleva directo a editarla
  }

  return (
    <Link to={`/proyecto/${proyecto.id}`} className="card project-card">
      <h3>{proyecto.nombre}</h3>
      {proyecto.descripcion && <p className="muted">{proyecto.descripcion}</p>}
      <div className="card-meta">
        <span>{proyecto.requerimientos.length} requerimiento(s)</span>
        <span>{fmtFecha.format(new Date(proyecto.actualizadoEn))}</span>
      </div>
      <button className="btn btn-mini" onClick={onDuplicar}>⧉ Duplicar</button>
    </Link>
  )
}