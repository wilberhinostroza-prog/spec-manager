import { useState, type FormEvent } from 'react'
import type { Project } from '../../types/proyecto'
import { useProjectsStore } from '../../stores/useProjectsStore'

interface Props {
  proyecto: Project
  onClose: () => void
}

export function EditProjectDialog({ proyecto, onClose }: Props) {
  const updateProject = useProjectsStore(s => s.updateProject)
  const [nombre, setNombre] = useState(proyecto.nombre)
  const [descripcion, setDescripcion] = useState(proyecto.descripcion)
  const [frontend, setFrontend] = useState(proyecto.stack.frontend)
  const [backend, setBackend] = useState(proyecto.stack.backend)
  const [db, setDb] = useState(proyecto.stack.db)
  const [error, setError] = useState('')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (nombre.trim() === '') {
      setError('El nombre es obligatorio.')
      return
    }
    await updateProject(proyecto.id, {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      stack: { frontend: frontend.trim(), backend: backend.trim(), db: db.trim() }
    })
    onClose()
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <form className="dialog" onSubmit={onSubmit}>
        <h2>Editar proyecto</h2>
        {error && <p className="error">{error}</p>}

        <label>Nombre *
          <input value={nombre} onChange={e => setNombre(e.target.value)} autoFocus />
        </label>
        <label>Descripción
          <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={2} />
        </label>

        <fieldset>
          <legend>Stack tecnológico</legend>
          <label>Frontend
            <input value={frontend} onChange={e => setFrontend(e.target.value)} />
          </label>
          <label>Backend
            <input value={backend} onChange={e => setBackend(e.target.value)} />
          </label>
          <label>Base de datos
            <input value={db} onChange={e => setDb(e.target.value)} />
          </label>
        </fieldset>

        <div className="dialog-actions">
          <button type="submit" className="btn btn-primary">Guardar cambios</button>
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}