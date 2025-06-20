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
    return new Activity(new Date(inicio), new Date(termino), titulo, color)
  }
}
