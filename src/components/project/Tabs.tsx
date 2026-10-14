export type TabId = 'resumen' | 'requerimientos' | 'historias'

const TABS: { id: TabId; label: string }[] = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'requerimientos', label: 'Requerimientos' },
  { id: 'historias', label: 'Historias' }
]

export function Tabs({ activa, onChange }: { activa: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="tabs">
      {TABS.map(t => (
        <button
          key={t.id}
          className={`tab ${activa === t.id ? 'tab-active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}