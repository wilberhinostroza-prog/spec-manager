import { SCHEMA_VERSION } from '../types/schema'
import type { Project, Requerimiento } from '../types/proyecto'

/** FR-10: JSON con schema versionado, listo para descargar o re-importar (AC-03). */
export function exportJSON(proyecto: Project): string {
  return JSON.stringify(
    { schemaVersion: SCHEMA_VERSION, proyectos: [proyecto] },
    null,
    2
  )
}

const PRIORIDAD: Record<Requerimiento['prioridad'], string> = {
  alta: 'alta', media: 'media', baja: 'baja'
}
const ESTADO: Record<Requerimiento['estado'], string> = {
  borrador: 'borrador', aprobado: 'aprobado',
  implementado: 'implementado', verificado: 'verificado'
}

/** FR-12: documento Markdown listo para pegar en un LLM (AC-05). */
export function exportMarkdown(p: Project): string {
  const stack = [p.stack.frontend, p.stack.backend, p.stack.db].filter(Boolean).join(' / ')

  const lineas: string[] = []
  lineas.push(`# Spec: ${p.nombre}`)
  lineas.push('')
  if (stack) lineas.push(`**Stack:** ${stack}`)
  if (p.descripcion) lineas.push(`**Descripción:** ${p.descripcion}`)
  lineas.push('')

  lineas.push('## Requerimientos')
  if (p.requerimientos.length === 0) {
    lineas.push('_Sin requerimientos definidos._')
  }
  for (const r of p.requerimientos) {
    const desc = r.descripcion ? ` — ${r.descripcion}` : ''
    lineas.push(`- **${r.codigo}** (${PRIORIDAD[r.prioridad]}, ${ESTADO[r.estado]}): ${r.titulo}${desc}`)
    for (const c of r.criterios) {
      lineas.push(`  - [${c.cumplido ? 'x' : ' '}] ${c.descripcion}`)
    }
  }
  lineas.push('')

  lineas.push('## Historias de usuario')
  if (p.historias.length === 0) {
    lineas.push('_Sin historias definidas._')
  }
  for (const h of p.historias) {
    lineas.push(`- **HU:** Como ${h.como} quiero ${h.quiero} para ${h.para}.`)
    for (const c of h.criterios) {
      lineas.push(`  - [${c.cumplido ? 'x' : ' '}] ${c.descripcion}`)
    }
  }

  return lineas.join('\n')
}

/** Nombre de archivo: spec-{slug}-{YYYY-MM-DD}.json */
export function exportFilename(proyecto: Project, extension: 'json' | 'md'): string {
  const slug = proyecto.nombre
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // sin acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'proyecto'
  const fecha = new Date().toISOString().slice(0, 10)
  return `spec-${slug}-${fecha}.${extension}`
}