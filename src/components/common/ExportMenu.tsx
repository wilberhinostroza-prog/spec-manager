import { useState } from 'react'
import type { Project } from '../../types/proyecto'
import { exportJSON, exportMarkdown, exportFilename } from '../../services/exportService'
import { download, copyToClipboard } from '../../services/download'

export function ExportMenu({ proyecto }: { proyecto: Project }) {
  const [abierto, setAbierto] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const onJSON = () => {
    download(exportFilename(proyecto, 'json'), exportJSON(proyecto))
    setMensaje('JSON descargado.')
    setAbierto(false)
  }

  const onMarkdown = async () => {
    const ok = await copyToClipboard(exportMarkdown(proyecto))
    setMensaje(ok ? 'Markdown copiado al portapapeles.' : 'No se pudo copiar.')
    setAbierto(false)
  }

  return (
    <div className="export-menu">
      <button className="btn" onClick={() => setAbierto(!abierto)}>Exportar ▾</button>
      {abierto && (
        <div className="dropdown">
          <button onClick={onJSON}>JSON (descargar)</button>
          <button onClick={onMarkdown}>Markdown (copiar)</button>
        </div>
      )}
      {mensaje && <span className="ok-msg export-msg">{mensaje}</span>}
    </div>
  )
}