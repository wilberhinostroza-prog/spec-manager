import { useState } from 'react'
import type { Requerimiento } from '../../types/proyecto'
import { CriterioList } from './CriterioList'
import { ReqForm } from './ReqForm'
import { useProjectsStore } from '../../stores/useProjectsStore'

const PRIORIDAD_LABEL: Record<Requerimiento['prioridad'], string> = {
  alta: 'Alta', media: 'Media', baja: 'Baja'
}
const ESTADO_LABEL: Record<Requerimiento['estado'], string> = {
  borrador: 'Borrador', aprobado: 'Aprobado',
  implementado: 'Implementado', verificado: 'Verificado'
}

export function ReqCard({ proyectoId, req }: { proyectoId: string; req: Requerimiento }) {
  const { deleteRequerimiento, addCriterio, toggleCriterio, deleteCriterio } =
    useProjectsStore()
  const [editando, setEditando] = useState(false)

  return (
    <div className="card req-card">
      <div className="req-head">
        <span className="req-code">{req.codigo}</span>
        <span className={`badge badge-${req.prioridad}`}>{PRIORIDAD_LABEL[req.prioridad]}</span>
        <span className={`badge badge-estado-${req.estado}`}>{ESTADO_LABEL[req.estado]}</span>
        {req.tipo === 'no_funcional' && <span className="badge">No funcional</span>}
        <span className="req-actions">
          <button className="btn btn-mini" onClick={() => setEditando(true)}>Editar</button>
          <button className="btn btn-mini btn-danger" onClick={() => deleteRequerimiento(proyectoId, req.id)}>✕</button>
        </span>
      </div>

      <h3>{req.titulo}</h3>
      {req.descripcion && <p className="muted">{req.descripcion}</p>}

      <CriterioList
        criterios={req.criterios}
        onAdd={desc => addCriterio(proyectoId, req.id, desc)}
        onToggle={cid => toggleCriterio(proyectoId, req.id, cid)}
        onDelete={cid => deleteCriterio(proyectoId, req.id, cid)}
      />

      {editando && (
        <ReqForm
          proyectoId={proyectoId}
          req={req}
          onClose={() => setEditando(false)}
        />
      )}
    </div>
  )
}