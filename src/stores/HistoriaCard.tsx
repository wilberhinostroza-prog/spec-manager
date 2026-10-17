import { useState } from 'react'
import type { Historia } from '../types/proyecto'
import { CriterioList } from '../components/project/CriterioList'
import { HistoriaForm } from '../components/project/HistoriaForm'
import { useProjectsStore } from './useProjectsStore'

export function HistoriaCard({ proyectoId, historia }: {
  proyectoId: string; historia: Historia
}) {
  const { deleteHistoria, addHistoriaCriterio, toggleHistoriaCriterio, deleteHistoriaCriterio } =
    useProjectsStore()
  const [editando, setEditando] = useState(false)

  return (
    <div className="card">
      <div className="req-head">
        <p className="historia-body">
          Como <strong>{historia.como}</strong> quiero <strong>{historia.quiero}</strong> para{' '}
          <strong>{historia.para}</strong>.
        </p>
        <span className="req-actions">
          <button className="btn btn-mini" onClick={() => setEditando(true)}>Editar</button>
          <button className="btn btn-mini btn-danger"
                  onClick={() => deleteHistoria(proyectoId, historia.id)}>✕</button>
        </span>
      </div>

      <CriterioList
        criterios={historia.criterios}
        onAdd={desc => addHistoriaCriterio(proyectoId, historia.id, desc)}
        onToggle={cid => toggleHistoriaCriterio(proyectoId, historia.id, cid)}
        onDelete={cid => deleteHistoriaCriterio(proyectoId, historia.id, cid)}
      />

      {editando && (
        <HistoriaForm proyectoId={proyectoId} historia={historia} onClose={() => setEditando(false)} />
      )}
    </div>
  )
}