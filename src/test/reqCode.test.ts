import { describe, it, expect } from 'vitest'
import { nextReqCode } from '../services/reqCode'

describe('nextReqCode', () => {
  it('lista vacía → REQ-01', () => {
    expect(nextReqCode([])).toBe('REQ-01')
  })

  it('continúa la secuencia', () => {
    expect(nextReqCode([{ codigo: 'REQ-01' }, { codigo: 'REQ-02' }])).toBe('REQ-03')
  })

  it('no recicla códigos de requerimientos eliminados (AC-02)', () => {
    // REQ-02 fue eliminado: el hueco NO se reutiliza
    expect(nextReqCode([{ codigo: 'REQ-01' }, { codigo: 'REQ-03' }])).toBe('REQ-04')
  })
})