import { useRef, useState, type ChangeEvent } from 'react'
import { validateImport } from '../../services/schema'
import { useProjectsStore } from '../../stores/useProjectsStore'
import type { Project } from '../../types/proyecto'

/** FR-11 / AC-04: valida el schema ANTES de tocar los datos existentes. */
export function ImportButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const importProjects = useProjectsStore(s => s.importProjects)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    let parsed: unknown
    try {
      parsed = JSON.parse(await file.text())
    } catch {
      setMensaje({ tipo: 'error', texto: 'El archivo no es un JSON válido.' })
      return
    }

    const result = validateImport(parsed)
    if (!result.ok || !result.data) {
      setMensaje({ tipo: 'error', texto: result.errors.join(' ') })
      return
    }

    const existentes = new Set(
      useProjectsStore.getState().proyectos.map((p: Project) => p.id)
    )
    const duplicados = result.data.proyectos.filter((p: Project) => existentes.has(p.id))
    if (duplicados.length > 0) {
      setMensaje({
        tipo: 'error',
        texto: `Ids duplicados con proyectos existentes: ${duplicados.map((p: Project) => p.nombre).join(', ')}.`
      })
      return
    }

    await importProjects(result.data.proyectos)
    setMensaje({ tipo: 'ok', texto: `${result.data.proyectos.length} proyecto(s) importado(s).` })
  }

  return (
    <div className="import">
      <button className="btn" onClick={() => inputRef.current?.click()}>Importar JSON</button>
      <input ref={inputRef} type="file" accept=".json,application/json"
             hidden onChange={onFile} />
      {mensaje && <p className={mensaje.tipo === 'ok' ? 'ok-msg' : 'error'}>{mensaje.texto}</p>}
    </div>
  )
}