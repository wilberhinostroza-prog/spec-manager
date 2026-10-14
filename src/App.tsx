import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './components/home/HomePage'
import { ProjectDetail } from './components/project/ProjectDetail'

export default function App() {
  return (
    // basename usa '/' en dev y '/spec-manager/' en producción (GitHub Pages)
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/proyecto/:id" element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>
  )
}