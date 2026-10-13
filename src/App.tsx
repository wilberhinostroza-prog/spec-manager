import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom'
import { HomePage } from './components/home/HomePage'

/** Placeholder T21 — la pantalla real llega en Fase 3. */
function ProjectDetailPlaceholder() {
  const { id } = useParams()
  return (
    <div className="page">
      <main>
        <Link to="/" className="btn">← Volver</Link>
        <h1>Proyecto</h1>
        <p className="muted">Detalle en construcción (Fase 3). Id: {id}</p>
      </main>
    </div>
  )
}

export default function App() {
  return (
    // basename usa '/' en dev y '/spec-manager/' en producción (GitHub Pages)
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/proyecto/:id" element={<ProjectDetailPlaceholder />} />
      </Routes>
    </BrowserRouter>
  )
}