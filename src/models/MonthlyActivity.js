/**
 * Clase que representa una actividad mensual
 */
export default class MonthlyActivity {
  /**
   * @param {Object} props
   * @param {Date} props.date - Fecha de la actividad
   * @param {string} props.title - Título de la actividad
   * @param {string} props.description - Descripción de la actividad
   * @param {string} props.color - Color en hexadecimal
   * @param {number} props.month - Mes al que pertenece (1-12)
   * @param {number} props.year - Año al que pertenece
   */
  constructor(props) {
    this.date = props.date || new Date()
    this.title = props.title || ''
    this.description = props.description || ''
    this.color = props.color || '#0ba14b'
    this.month = props.month || this.date.getMonth() + 1
    this.year = props.year || this.date.getFullYear()
  }

  /**
   * Crea una actividad mensual desde una fila de CSV
   * @param {string[]} row - Fila CSV [fecha, titulo, descripcion, color, mes, año]
   * @returns {MonthlyActivity}
   */
  static fromArray(row) {
    const [dateStr, title, description, color, monthStr, yearStr] = row
    
    // Parsear la fecha
    let date
    try {
      // Para fechas en formato ISO (YYYY-MM-DD) sin desfase por zona horaria
      if (dateStr.includes('-')) {
        const [year, month, day] = dateStr.split('-').map(Number)
        // Crear la fecha usando el constructor con año, mes (0-11) y día
        date = new Date(year, month - 1, day)
      } 
      // Formato DD/MM/YYYY
      else if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/').map(Number)
        date = new Date(year, month - 1, day)
      } 
      // Otros formatos como fallback
      else {
        date = new Date(dateStr)
      }
      
      if (isNaN(date.getTime())) {
        throw new Error('Fecha inválida')
      }
    } catch (e) {
      console.error(`Error parseando fecha: ${dateStr}`, e)
      date = new Date() // Fecha actual como fallback
    }
    
    // Parsear mes y año
    const month = parseInt(monthStr, 10) || date.getMonth() + 1
    const year = parseInt(yearStr, 10) || date.getFullYear()
    
    return new MonthlyActivity({
      date,
      title,
      description,
      color,
      month,
      year
    })
  }
}
