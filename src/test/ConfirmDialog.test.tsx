import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmDialog } from '../components/common/ConfirmDialog'

describe('ConfirmDialog', () => {
  it('no renderiza nada cuando open es false', () => {
    const { container } = render(
      <ConfirmDialog open={false} mensaje="¿Eliminar?" onConfirm={() => {}} onCancel={() => {}} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('muestra el mensaje y los dos botones cuando open es true', () => {
    render(
      <ConfirmDialog open mensaje="¿Eliminar proyecto?" onConfirm={() => {}} onCancel={() => {}} />
    )
    expect(screen.getByText('¿Eliminar proyecto?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('llama onConfirm y onCancel al pulsar cada botón', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(<ConfirmDialog open mensaje="x" onConfirm={onConfirm} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})