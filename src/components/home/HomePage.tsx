import { useEffect, useState } from 'react'
import { useProjectsStore } from '../../stores/useProjectsStore'
import { ProjectList } from './ProjectList'
import { NewProjectDialog } from './NewProjectDialog'
import { ImportButton } from '../common/ImportButton'

export function HomePage() {
  const cargado = useProjectsStore(s => s.cargado)
  const loadProjects = useProjectsStore(s => s.loadProjects)
  const [mostrarNuevo, setMostrarNuevo] = useState(false)

  useEffect(() => {
    if (!cargado) loadProjects()
  }, [cargado, loadProjects])

  return (
    <div className="page">
      <header className="page-header">
        <h1>Spec Manager</h1>
        <div className="header-actions">
          <ImportButton />
          <button className="btn btn-primary" onClick={() => setMostrarNuevo(true)}>
            Nuevo proyecto
          </button>
        </div>
      </header>
      <main>
        <ProjectList />
      </main>
      {mostrarNuevo && <NewProjectDialog onClose={() => setMostrarNuevo(false)} />}
    </div>
  )
}