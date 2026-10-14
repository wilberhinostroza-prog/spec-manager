import { useState, type FormEvent } from 'react'
import type { Requerimiento } from '../../types/proyecto'
import { useProjectsStore } from '../../stores/useProjectsStore'

interface Props {
  proyectoId: string
  req?: Requerimiento          // si viene, es edición; si no, es alta
  onClose: () => void
}

export function ReqForm({ proyectoId, req, onClose }: Props) {
  const addRequerimiento = useProjectsStore(s => s.addRequerimiento)
  const updateRequerimiento = useProjectsStore(s => s.updateRequerimiento)

  const [titulo, setTitulo] = useState(req?.titulo ?? '')
  const [descripcion, setDescripcion] = useState(req?.descripcion ?? '')
  const [tipo, setTipo] = useState<Requerimiento['tipo']>(req?.tipo ?? 'funcional')
  const [prioridad, setPrioridad] = useState<Requerimiento['prioridad']>(req?.prioridad ?? 'media')
  const [estado, setEstado] = useState<Requerimiento['estado']>(req?.estado ?? 'borrador')
  const [error, setError] = useState('')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (titulo.trim() === '') {
      setError('El título es obligatorio.')
      return
    }
    if (req) {
      await updateRequerimiento(proyectoId, req.id, { titulo, descripcion, tipo, prioridad, estado })
    } else {
      await addRequerimiento(proyectoId, { titulo, descripcion, tipo, prioridad, estado })
    }
    onClose()
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <form className="dialog" onSubmit={onSubmit}>
        <h2>{req ? `Editar ${req.codigo}` : 'Nuevo requerimiento'}</h2>
        {error && <p className="error">{error}</p>}

        <label>Título *
          <input value={titulo} onChange={e => setTitulo(e.target.value)} autoFocus />
        </label>
        <label>Descripción
          <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={2} />
        </label>

        <div className="form-row">
          <label>Tipo
            <select value={tipo} onChange={e => setTipo(e.target.value as Requerimiento['tipo'])}>
              <option value="funcional">Funcional</option>
              <option value="no_funcional">No funcional</option>
            </select>
          </label>
          <label>Prioridad
            <select value={prioridad} onChange={e => setPrioridad(e.target.value as Requerimiento['prioridad'])}>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </label>
          <label>Estado
            <select value={estado} onChange={e => setEstado(e.target.value as Requerimiento['estado'])}>
              <option value="borrador">Borrador</option>
              <option value="aprobado">Aprobado</option>
              <option value="implementado">Implementado</option>
              <option value="verificado">Verificado</option>
            </select>
          </label>
        </div>

        <div className="dialog-actions">
          <button type="submit" className="btn btn-primary">{req ? 'Guardar' : 'Agregar'}</button>
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}