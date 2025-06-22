export default class Activity {
  /**
   * @param {Date} startDate fecha de inicio
   * @param {Date} endDate   fecha de término (inclusive)
   * @param {string} title   nombre de la actividad
   * @param {string} color   color hexadecimal o css válido
   */
  constructor(startDate, endDate, title, color) {
    this.startDate = startDate
    this.endDate = endDate
    this.title = title
    this.color = color
  }

  /**
   * Crea una instancia a partir de un arreglo proveniente del CSV.
   * Espera: [inicio, termino, titulo, color]
   */
  static fromArray([inicio, termino, titulo, color]) {
    // Crear fechas asegurando el formato correcto
    // Si las fechas vienen en formato DD/MM/YYYY, las convertimos
    let startDate, endDate;
    
    if (typeof inicio === 'string') {
      if (inicio.includes('/')) {
        // Formato DD/MM/YYYY o MM/DD/YYYY - asumimos DD/MM/YYYY para México
        const [day, month, year] = inicio.split('/').map(Number);
        startDate = new Date(year, month - 1, day); // month es 0-indexed
      } else if (inicio.includes('-')) {
        // Formato ISO YYYY-MM-DD
        const [year, month, day] = inicio.split('-').map(Number);
        startDate = new Date(year, month - 1, day); // Crea la fecha en zona horaria local
      } else {
        // Otro formato, intentar con el constructor estándar
        startDate = new Date(inicio);
      }
    } else {
      startDate = new Date(inicio);
    }
    
    if (typeof termino === 'string') {
      if (termino.includes('/')) {
        // Formato DD/MM/YYYY o MM/DD/YYYY - asumimos DD/MM/YYYY para México
        const [day, month, year] = termino.split('/').map(Number);
        endDate = new Date(year, month - 1, day); // month es 0-indexed
      } else if (termino.includes('-')) {
        // Formato ISO YYYY-MM-DD
        const [year, month, day] = termino.split('-').map(Number);
        endDate = new Date(year, month - 1, day); // Crea la fecha en zona horaria local
      } else {
        // Otro formato, intentar con el constructor estándar
        endDate = new Date(termino);
      }
    } else {
      endDate = new Date(termino);
    }
    
    // Validar que las fechas son válidas
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.warn('Fechas inválidas en CSV:', { inicio, termino });
      // Usar fechas por defecto si hay error
      startDate = new Date();
      endDate = new Date();
    }
    
    return new Activity(startDate, endDate, titulo, color);
  }

  /**
   * Formatea una fecha en español de México
   * @param {Date} date - La fecha a formatear
   * @param {string} style - 'short', 'medium', 'long', 'full'
   * @returns {string} Fecha formateada
   */
  static formatDateES(date, style = 'medium') {
    return date.toLocaleDateString('es-MX', {
      dateStyle: style
    })
  }

  /**
   * Formatea la fecha de inicio en español de México
   * @param {string} style - 'short', 'medium', 'long', 'full'
   * @returns {string} Fecha de inicio formateada
   */
  getFormattedStartDate(style = 'medium') {
    return Activity.formatDateES(this.startDate, style)
  }

  /**
   * Formatea la fecha de término en español de México
   * @param {string} style - 'short', 'medium', 'long', 'full'
   * @returns {string} Fecha de término formateada
   */
  getFormattedEndDate(style = 'medium') {
    return Activity.formatDateES(this.endDate, style)
  }

  /**
   * Obtiene un rango de fechas formateado en español de México
   * @param {string} style - 'short', 'medium', 'long', 'full'
   * @returns {string} Rango de fechas formateado
   */
  getFormattedDateRange(style = 'medium') {
    const start = this.getFormattedStartDate(style)
    const end = this.getFormattedEndDate(style)
    
    if (this.startDate.toDateString() === this.endDate.toDateString()) {
      return start
    }
    
    return `${start} - ${end}`
  }

  /**
   * Formatea fecha con opciones personalizadas
   * @param {Date} date - La fecha a formatear
   * @param {Object} options - Opciones de formato
   * @returns {string} Fecha formateada
   */
  static formatDateCustom(date, options = {}) {
    const defaultOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    
    return date.toLocaleDateString('es-MX', { ...defaultOptions, ...options })
  }
}
