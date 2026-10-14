import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Project } from '../../types/proyecto'
import { useProjectsStore } from '../../stores/useProjectsStore'
import { ConfirmDialog } from '../common/ConfirmDialog'

export function ProjectHeader({ proyecto }: { proyecto: Project }) {
  const deleteProject = useProjectsStore(s => s.deleteProject)
  const navigate = useNavigate()
  const [confirmando, setConfirmando] = useState(false)

  const onEliminar = async () => {
    await deleteProject(proyecto.id)
    navigate('/')
  }

  return (
    <header className="page-header">
      <div className="title-row">
        <Link to="/" className="btn">← Volver</Link>
        <h1>{proyecto.nombre}</h1>
      </div>
      <div className="header-actions">
        <button className="btn btn-danger" onClick={() => setConfirmando(true)}>
          Eliminar
        </button>
      </div>
      <ConfirmDialog
        open={confirmando}
        mensaje={`¿Eliminar el proyecto "${proyecto.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={onEliminar}
        onCancel={() => setConfirmando(false)}
      />
    </header>
  )
}