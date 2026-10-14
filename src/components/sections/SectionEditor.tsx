import { useState } from 'react'
import type { Seccion } from '../../types/proyecto'
import { useProjectsStore } from '../../stores/useProjectsStore'

/** Una sección: textarea con guardado automático al perder el foco (onBlur). */
function SectionItem({
  proyectoId, seccion
}: { proyectoId: string; seccion: Seccion }) {
  const updateProject = useProjectsStore(s => s.updateProject)
  const [contenido, setContenido] = useState(seccion.contenido)

  const guardar = async () => {
    if (contenido === seccion.contenido) return
    const proyecto = useProjectsStore.getState().proyectos.find(p => p.id === proyectoId)
    if (!proyecto) return
    const secciones = proyecto.secciones.map(s =>
      s.id === seccion.id ? { ...s, contenido } : s
    )
    await updateProject(proyectoId, { secciones })
  }

  return (
    <div className="section-item">
      <h3>{seccion.titulo}</h3>
      <textarea
        rows={4}
        value={contenido}
        placeholder={`Escribe aquí la sección "${seccion.titulo}"...`}
        onChange={e => setContenido(e.target.value)}
        onBlur={guardar}
      />
    </div>
  )
}

export function SectionEditor({ proyectoId, secciones }: {
  proyectoId: string; secciones: Seccion[]
}) {
  return (
    <div className="section-list">
      {secciones.map(s => (
        <SectionItem key={s.id} proyectoId={proyectoId} seccion={s} />
      ))}
    </div>
  )
}