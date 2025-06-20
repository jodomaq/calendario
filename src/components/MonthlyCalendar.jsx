import { useState, useEffect } from 'react'
import { format, addMonths, getDay, getDaysInMonth, isEqual } from 'date-fns'
import { es } from 'date-fns/locale'
import { useCalendar } from '../context/CalendarContext.jsx'
import React from 'react'
import { exportToPdf } from '../utils/pdfExport.js'
import './MonthlyCalendar.css'

export default function MonthlyCalendar() {
  const { config, activities, view, setView } = useCalendar()
  const [currentDate, setCurrentDate] = useState(null)

  // Referencia para exportar a PDF
  const monthlyRef = React.useRef(null)

  // Función para exportar a PDF
  const handleExportPdf = () => {
    if (monthlyRef.current) {
      const monthName = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), 'MMMM', { locale: es })
      exportToPdf(
        monthlyRef.current,
        `Calendario-${monthName.charAt(0).toUpperCase() + monthName.slice(1)}-${currentDate.getFullYear()}`,
        false // Orientación vertical
      )
    }
  }

  // Inicializar la fecha actual basada en la vista seleccionada
  useEffect(() => {
    if (view.year && view.month !== undefined) {
      setCurrentDate(new Date(view.year, view.month, 1))
    }
  }, [view.year, view.month])

  if (!currentDate) return null

  const daysInMonth = getDaysInMonth(currentDate)
  const startWeekDay = getDay(currentDate) // 0 (Dom) - 6 (Sáb)
  const monthName = format(currentDate, 'LLLL yyyy', { locale: es })

  // Navegación de meses
  const goToPrevMonth = () => {
    const prevMonth = addMonths(currentDate, -1)
    setCurrentDate(prevMonth)
    setView({...view, year: prevMonth.getFullYear(), month: prevMonth.getMonth()})
  }

  const goToNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1)
    setCurrentDate(nextMonth)
    setView({...view, year: nextMonth.getFullYear(), month: nextMonth.getMonth()})
  }

  const goToAnnualView = () => {
    setView({ type: 'annual', year: currentDate.getFullYear() })
  }

  // Días del mes (incluyendo espacios vacíos iniciales)
  const days = []
  for (let i = 0; i < startWeekDay; i++) {
    days.push(null) // Espacios vacíos iniciales
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  // Encuentra actividades para un día específico
  function getActivitiesForDay(day) {
    if (!day) return [] // Si es espacio vacío
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    
    return activities.filter(activity => {
      // Fecha entre inicio y fin de la actividad (inclusive)
      return activity.startDate <= date && date <= activity.endDate
    })
  }

  // Para decidir si un día es el inicio de una actividad
  function isActivityStart(activity, day) {
    if (!day) return false
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return isEqual(
      new Date(activity.startDate.getFullYear(), activity.startDate.getMonth(), activity.startDate.getDate()),
      new Date(date.getFullYear(), date.getMonth(), date.getDate())
    )
  }

  return (
    <div className="monthly-calendar-container" ref={monthlyRef}>
      <div className="monthly-calendar">
        <div className="monthly-header">
          <button className="back-button" onClick={goToAnnualView}>
            ⬅️ Vista Anual
          </button>
          <div className="month-navigation">
            <button onClick={goToPrevMonth}>&lt;</button>
            <h2>{monthName}</h2>
            <button onClick={goToNextMonth}>&gt;</button>
          </div>
          <button className="export-button" onClick={handleExportPdf} title="Exportar a PDF">
            <span role="img" aria-label="PDF">📄</span> PDF
          </button>
        </div>

        <div className="calendar-grid">
          {/* Encabezados de los días de la semana */}
          {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(day => (
            <div key={day} className="weekday-header">{day}</div>
          ))}

          {/* Celdas de los días */}
          {days.map((day, index) => {
            const dayActivities = getActivitiesForDay(day)
            
            return (
              <div 
                key={index} 
                className={`day-cell-month ${!day ? 'empty-day' : ''}`}
              >
                {day && (
                  <>
                    <div className="day-number">{day}</div>
                    <div className="day-activities">
                      {dayActivities.map((activity, actIndex) => (
                        isActivityStart(activity, day) && (
                          <div 
                            key={actIndex}
                            className="activity-item"
                            style={{ backgroundColor: activity.color }}
                          >
                            {activity.title}
                          </div>
                        )
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Lista de actividades con colores (Leyenda) */}
      <div className="activities-legend">
        <div className="legend-header">
          <h3>Actividades</h3>
        </div>
        <div className="legend-items">
          {activities.map((activity, index) => (
            <div className="legend-item" key={index}>
              <div 
                className="legend-color" 
                style={{ backgroundColor: activity.color }}
              ></div>
              <div className="legend-text">{activity.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
