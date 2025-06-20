import Papa from 'papaparse'
import { xml2js } from 'xml-js'
import Activity from '../models/Activity.js'
import CalendarConfig from '../models/CalendarConfig.js'

export default class CalendarService {
  /**
   * Carga la configuración desde un archivo XML
   * @param {string} path ruta del XML (relativa al public/)
   * @returns {Promise<CalendarConfig>}
   */
  static async loadConfig(path = '/data/config.xml') {
    let xmlText = ''
    let ok = false
    try {
      const res = await fetch(path)
      ok = res.ok
      if (ok) {
        xmlText = await res.text()
      }
    } catch (_) {
      ok = false
    }
    if (!ok) {
      // Devuelve configuración por defecto (agosto año actual)
      return new CalendarConfig({})
    }
    const xmlObj = xml2js(xmlText, { compact: true })
    const cfg = xmlObj.config || {}
    return new CalendarConfig({
      inicioMes: cfg.inicioMes?._text,
      inicioAnio: cfg.inicioAnio?._text,
      version: cfg.version?._text ?? '1.0',
      fechaEmision: cfg.fechaEmision?._text ?? new Date().toISOString().substring(0, 10),
    })
  }

  /**
   * Carga actividades desde un CSV
   * @param {string} path ruta del CSV (relativa al public/)
   * @returns {Promise<Activity[]>}
   */
  static async loadActivities(path = '/data/activities.csv') {
    const res = await fetch(path)
    if (!res.ok) throw new Error(`No se pudo cargar actividades CSV: ${res.status}`)
    const csvText = await res.text()
    const { data } = Papa.parse(csvText, { skipEmptyLines: true })
    // descarta cabecera si existe
    const rows = data.filter((r) => r.length >= 4 && !r[0].toLowerCase().includes('fecha'))
    return rows.map(Activity.fromArray)
  }
}
