import { useState, type FormEvent } from 'react'
import type { Criterio } from '../../types/proyecto'

interface Props {
  criterios: Criterio[]
  onToggle: (criterioId: string) => void
  onDelete: (criterioId: string) => void
  onAdd: (descripcion: string) => void
}

export function CriterioList({ criterios, onToggle, onDelete, onAdd }: Props) {
  const [nuevo, setNuevo] = useState('')

  const agregar = (e: FormEvent) => {
    e.preventDefault()
    if (nuevo.trim() === '') return
    onAdd(nuevo)
    setNuevo('')
  }

  return (
    <div className="criterios">
      {criterios.length > 0 && (
        <ul className="criterio-list">
          {criterios.map(c => (
            <li key={c.id} className={c.cumplido ? 'criterio-done' : ''}>
              <label className="criterio-item">
                <input type="checkbox" checked={c.cumplido} onChange={() => onToggle(c.id)} />
                <span>{c.descripcion}</span>
              </label>
              <button className="btn btn-mini" onClick={() => onDelete(c.id)} title="Eliminar criterio">✕</button>
            </li>
          ))}
        </ul>
      )}
      <form className="criterio-form" onSubmit={agregar}>
        <input
          value={nuevo}
          onChange={e => setNuevo(e.target.value)}
          placeholder="Agregar criterio de aceptación..."
        />
        <button type="submit" className="btn">Agregar</button>
      </form>
    </div>
  )
}