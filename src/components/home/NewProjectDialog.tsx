import { useState, type FormEvent } from 'react'
import { useProjectsStore } from '../../stores/useProjectsStore'
import { useNavigate } from 'react-router-dom'

interface Props {
  onClose: () => void
}

export function NewProjectDialog({ onClose }: Props) {
  const addProject = useProjectsStore(s => s.addProject)
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [frontend, setFrontend] = useState('')
  const [backend, setBackend] = useState('')
  const [db, setDb] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (nombre.trim() === '') {
      setError('El nombre es obligatorio.')
      return
    }
    const proyecto = await addProject({ nombre, descripcion, frontend, backend, db })
    navigate(`/proyecto/${proyecto.id}`)
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <form className="dialog" onSubmit={onSubmit}>
        <h2>Nuevo proyecto</h2>
        {error && <p className="error">{error}</p>}

        <label>Nombre *
          <input value={nombre} onChange={e => setNombre(e.target.value)} autoFocus />
        </label>
        <label>Descripción
          <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={2} />
        </label>

        <fieldset>
          <legend>Stack tecnológico (opcional)</legend>
          <label>Frontend
            <input value={frontend} onChange={e => setFrontend(e.target.value)} placeholder="React" />
          </label>
          <label>Backend
            <input value={backend} onChange={e => setBackend(e.target.value)} placeholder="FastAPI" />
          </label>
          <label>Base de datos
            <input value={db} onChange={e => setDb(e.target.value)} placeholder="SQLite" />
          </label>
        </fieldset>

        <div className="dialog-actions">
          <button type="submit" className="btn btn-primary">Crear proyecto</button>
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}