import React from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useCalendar } from '../context/CalendarContext.jsx'
import { exportToPdf } from '../utils/pdfExport.js'
import './AnnualCalendar.css'
import MonthMini from './MonthMini.jsx'

export default function AnnualCalendar() {
  const { config, activities, loading, error, setView } = useCalendar()
  
  // Referencia para exportar a PDF
  const calendarRef = React.useRef(null)
  
  // Función para exportar a PDF
  const handleExportPdf = () => {
    if (calendarRef.current) {
      exportToPdf(
        calendarRef.current,
        `Calendario-Escolar-${config.startYear}-${config.startYear + 1}`,
        true // Orientación apaisada
      )
    }
  }

  if (loading) return <p>Cargando calendario…</p>
  if (error) return <p>Error: {error.message}</p>

  const months = Array.from({ length: 12 }, (_, i) => {
    const monthIndex = (config.startMonth - 1 + i) % 12
    const year = config.startYear + Math.floor((config.startMonth - 1 + i) / 12)
    return { monthIndex, year }
  })

  return (
    <div className="annual-wrapper" ref={calendarRef}>
      <header className="annual-header">
        <h1>Calendario escolar {config.startYear}-{config.startYear + 1}</h1>
        <div className="header-actions">
          <small>Versión {config.version} – emitido {format(config.issueDate, 'dd/MM/yyyy', { locale: es })}</small>
          <button className="export-button" onClick={handleExportPdf} title="Exportar a PDF">
            <span role="img" aria-label="PDF">📄</span> PDF
          </button>
        </div>
      </header>
      <div className="months-grid">
        {months.map(({ monthIndex, year }) => (
          <MonthMini
            key={`${year}-${monthIndex}`}
            monthIndex={monthIndex}
            year={year}
            activities={activities}
            label={format(new Date(year, monthIndex, 1), 'MMMM yyyy', { locale: es })}
            onClick={() => setView({ type: 'month', year, month: monthIndex })}
          />
        ))}
      </div>
    </div>
  )
}
