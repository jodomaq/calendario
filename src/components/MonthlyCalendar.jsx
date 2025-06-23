import { useState, useEffect } from 'react'
import { format, addMonths, getDay, getDaysInMonth, isEqual } from 'date-fns'
import { es } from 'date-fns/locale'
import { useCalendar } from '../context/CalendarContext.jsx'
import React from 'react'
import { exportToPdf } from '../utils/pdfExport.js'
import './MonthlyCalendar.css'

// Componente para mostrar el popup con detalles de la actividad
const ActivityPopup = ({ activity, onClose }) => {
  if (!activity) return null

  const actDate = new Date(activity.date)
  
  return (
    <div className="activity-popup-overlay" onClick={onClose}>
      <div className="activity-popup" onClick={e => e.stopPropagation()}>
        <button className="close-popup" onClick={onClose}>×</button>
        <h3 className="popup-title" style={{ color: activity.color }}>{activity.title}</h3>
        <div className="popup-details">
          <p><strong>Fecha:</strong> {actDate.toLocaleDateString('es-MX')}</p>
          {activity.description && (
            <p><strong>Descripción:</strong> {activity.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MonthlyCalendar() {
  const { config, monthlyActivities, view, setView } = useCalendar()
  const [currentDate, setCurrentDate] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)

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
    
    // Actividades mensuales específicas (por fecha exacta)
    return monthlyActivities.filter(activity => {
      const actDate = new Date(activity.date)
      return (
        actDate.getDate() === date.getDate() && 
        actDate.getMonth() === date.getMonth() && 
        actDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Para decidir si un día es el inicio de una actividad
  function isActivityStart(activity, day) {
    if (!day) return false
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    
    // Comparamos con la fecha de la actividad mensual
    const actDate = new Date(activity.date)
    return (
      actDate.getDate() === date.getDate() && 
      actDate.getMonth() === date.getMonth() && 
      actDate.getFullYear() === date.getFullYear()
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
                            onClick={() => setSelectedActivity(activity)}
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
        <div className="legend-items">
          {/* Actividades mensuales */}
          {monthlyActivities.length > 0 && (
            <div className="legend-section">
              <h4>Actividades mensuales</h4>
              {monthlyActivities.map((activity, index) => (
                <div 
                  className="legend-item" 
                  key={`monthly-${index}`}
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: activity.color }}
                  ></div>
                  <div className="legend-text" title={activity.description}>
                    {new Date(activity.date).toLocaleDateString('es-MX')} - {activity.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popup de detalles de actividad */}
      {selectedActivity && (
        <ActivityPopup 
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  )
}
