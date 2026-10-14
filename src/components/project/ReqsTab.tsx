import { useState } from 'react'
import type { Project, Requerimiento } from '../../types/proyecto'
import { ReqCard } from './ReqCard'
import { ReqForm } from './ReqForm'

type FiltroPrioridad = 'todas' | Requerimiento['prioridad']
type FiltroEstado = 'todos' | Requerimiento['estado']

export function ReqsTab({ proyecto }: { proyecto: Project }) {
  const [filtroP, setFiltroP] = useState<FiltroPrioridad>('todas')
  const [filtroE, setFiltroE] = useState<FiltroEstado>('todos')
  const [mostrarForm, setMostrarForm] = useState(false)

  const filtrados = proyecto.requerimientos.filter(r =>
    (filtroP === 'todas' || r.prioridad === filtroP) &&
    (filtroE === 'todos' || r.estado === filtroE)
  )

  return (
    <div>
      <div className="req-toolbar">
        <button className="btn btn-primary" onClick={() => setMostrarForm(true)}>
          + Nuevo requerimiento
        </button>
        <div className="filtros">
          <select value={filtroP} onChange={e => setFiltroP(e.target.value as FiltroPrioridad)}>
            <option value="todas">Prioridad: todas</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
          <select value={filtroE} onChange={e => setFiltroE(e.target.value as FiltroEstado)}>
            <option value="todos">Estado: todos</option>
            <option value="borrador">Borrador</option>
            <option value="aprobado">Aprobado</option>
            <option value="implementado">Implementado</option>
            <option value="verificado">Verificado</option>
          </select>
          <span className="muted">{filtrados.length} de {proyecto.requerimientos.length}</span>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="empty-state">
          <p className="muted">
            {proyecto.requerimientos.length === 0
              ? 'Sin requerimientos todavía.'
              : 'Ningún requerimiento coincide con los filtros.'}
          </p>
        </div>
      ) : (
        <div className="req-list">
          {filtrados.map(r => (
            <ReqCard key={r.id} proyectoId={proyecto.id} req={r} />
          ))}
        </div>
      )}

      {mostrarForm && (
        <ReqForm proyectoId={proyecto.id} onClose={() => setMostrarForm(false)} />
      )}
    </div>
  )
}