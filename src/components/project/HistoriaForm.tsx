import { useState, type FormEvent } from 'react'
import type { Criterio, Historia } from '../../types/proyecto'
import { useProjectsStore } from '../../stores/useProjectsStore'
import { uuid } from '../../services/uuid'

interface Props {
  proyectoId: string
  historia?: Historia                 // si viene, es edición
  onClose: () => void
}

export function HistoriaForm({ proyectoId, historia, onClose }: Props) {
  const addHistoria = useProjectsStore(s => s.addHistoria)
  const updateHistoria = useProjectsStore(s => s.updateHistoria)

  const [como, setComo] = useState(historia?.como ?? '')
  const [quiero, setQuiero] = useState(historia?.quiero ?? '')
  const [para, setPara] = useState(historia?.para ?? '')
  // Criterio exige id: los nuevos reciben uno temporal apenas se agregan
  const [criterios, setCriterios] = useState<Criterio[]>(
    historia?.criterios.map(c => ({ ...c })) ?? []
  )
  const [nuevoCriterio, setNuevoCriterio] = useState('')
  const [error, setError] = useState('')

  const agregarCriterio = (e: FormEvent) => {
    e.preventDefault()
    if (nuevoCriterio.trim() === '') return
    setCriterios([...criterios, {
      id: uuid(),
      descripcion: nuevoCriterio.trim(),
      cumplido: false
    }])
    setNuevoCriterio('')
  }

  const quitarCriterio = (index: number) => {
    setCriterios(criterios.filter((_, i) => i !== index))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (como.trim() === '' || quiero.trim() === '' || para.trim() === '') {
      setError('Los tres campos (Como / Quiero / Para) son obligatorios.')
      return
    }
    if (historia) {
      await updateHistoria(proyectoId, historia.id, { como, quiero, para, criterios })
    } else {
      await addHistoria(proyectoId, { como, quiero, para, criterios })
    }
    onClose()
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <form className="dialog" onSubmit={onSubmit}>
        <h2>{historia ? 'Editar historia' : 'Nueva historia de usuario'}</h2>
        {error && <p className="error">{error}</p>}

        <label>Como (rol) *
          <input value={como} onChange={e => setComo(e.target.value)} placeholder="desarrollador" autoFocus />
        </label>
        <label>Quiero (acción) *
          <input value={quiero} onChange={e => setQuiero(e.target.value)} placeholder="exportar el proyecto a Markdown" />
        </label>
        <label>Para (beneficio) *
          <input value={para} onChange={e => setPara(e.target.value)} placeholder="pegárselo a mi agente de IA" />
        </label>

        <fieldset>
          <legend>Criterios de aceptación</legend>
          {criterios.map((c, i) => (
            <div key={c.id} className="crit-edit-row">
              <span>{c.descripcion}</span>
              <button type="button" className="btn btn-mini" onClick={() => quitarCriterio(i)}>✕</button>
            </div>
          ))}
          <div className="criterio-form">
            <input value={nuevoCriterio} onChange={e => setNuevoCriterio(e.target.value)}
                   placeholder="Agregar criterio..." />
            <button type="button" className="btn" onClick={agregarCriterio}>Agregar</button>
          </div>
        </fieldset>

        <div className="dialog-actions">
          <button type="submit" className="btn btn-primary">{historia ? 'Guardar' : 'Agregar'}</button>
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}