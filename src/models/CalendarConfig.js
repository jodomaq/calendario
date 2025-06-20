/**
 * Representa la configuración del calendario proveniente del XML
 * Ejemplo de XML esperado:
 * <config>
 *   <inicioMes>8</inicioMes> <!-- agosto = 8 -->
 *   <inicioAnio>2024</inicioAnio>
 *   <version>1.0</version>
 *   <fechaEmision>2025-06-19</fechaEmision>
 * </config>
 */
export default class CalendarConfig {
  constructor({ inicioMes = 8, inicioAnio = new Date().getFullYear(), version = '1.0', fechaEmision = new Date().toISOString().substring(0, 10) }) {
    this.startMonth = Number(inicioMes) || 8 // 1–12
    this.startYear = Number(inicioAnio) || new Date().getFullYear()
    this.version = version
    this.issueDate = new Date(fechaEmision)
  }
}
