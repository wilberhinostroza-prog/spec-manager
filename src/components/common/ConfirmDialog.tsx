interface Props {
  open: boolean
  mensaje: string
  onConfirm: () => void
  onCancel: () => void
}

/** Modal reutilizable de confirmación (FR-04: eliminar proyecto). */
export function ConfirmDialog({ open, mensaje, onConfirm, onCancel }: Props) {
  if (!open) return null
  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="dialog">
        <p>{mensaje}</p>
        <div className="dialog-actions">
          <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
          <button className="btn" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}