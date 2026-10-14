/**
 * Genera el siguiente código REQ-NN para un proyecto (FR-05).
 * Nunca recicla códigos: usa el máximo existente + 1, aunque haya huecos
 * por requerimientos eliminados (AC-02).
 */
export function nextReqCode(reqs: { codigo: string }[]): string {
  const max = reqs.reduce((m, r) => {
    const n = parseInt(r.codigo.replace('REQ-', ''), 10)
    return Number.isNaN(n) ? m : Math.max(m, n)
  }, 0)
  return `REQ-${String(max + 1).padStart(2, '0')}`
}