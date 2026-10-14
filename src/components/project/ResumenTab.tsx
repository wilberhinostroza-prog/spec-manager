import type { Project } from '../../types/proyecto'
import { SectionEditor } from '../sections/SectionEditor'

export function ResumenTab({ proyecto }: { proyecto: Project }) {
  return (
    <div>
      {proyecto.descripcion && <p className="muted">{proyecto.descripcion}</p>}

      {(proyecto.stack.frontend || proyecto.stack.backend || proyecto.stack.db) && (
        <div className="stack-chips">
          {proyecto.stack.frontend && <span className="chip">{proyecto.stack.frontend}</span>}
          {proyecto.stack.backend && <span className="chip">{proyecto.stack.backend}</span>}
          {proyecto.stack.db && <span className="chip">{proyecto.stack.db}</span>}
        </div>
      )}

      <SectionEditor proyectoId={proyecto.id} secciones={proyecto.secciones} />
    </div>
  )
}