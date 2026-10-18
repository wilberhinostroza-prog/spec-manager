/**
 * Genera un UUID v4.
 * Usa crypto.randomUUID() cuando existe (navegadores modernos) y
 * un fallback Math.random para navegadores antiguos o contextos no seguros.
 * Válido para ids locales; no usar para fines criptográficos.
 */
export function uuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}