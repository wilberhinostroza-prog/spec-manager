import { useState } from 'react'
import type { Project } from '../types/proyecto'
import { HistoriaCard } from './HistoriaCard'
import { HistoriaForm } from '../components/project/HistoriaForm'

export function HistoriasTab({ proyecto }: { proyecto: Project }) {
  const [mostrarForm, setMostrarForm] = useState(false)

  return (
    <div>
      <div className="req-toolbar">
        <button className="btn btn-primary" onClick={() => setMostrarForm(true)}>
          + Nueva historia
        </button>
        <span className="muted">{proyecto.historias.length} historia(s)</span>
      </div>

      {proyecto.historias.length === 0 ? (
        <div className="empty-state">
          <p className="muted">Sin historias todavía.</p>
        </div>
      ) : (
        <div className="req-list">
          {proyecto.historias.map(h => (
            <HistoriaCard key={h.id} proyectoId={proyecto.id} historia={h} />
          ))}
        </div>
      )}

      {mostrarForm && (
        <HistoriaForm proyectoId={proyecto.id} onClose={() => setMostrarForm(false)} />
      )}
    </div>
  )
}