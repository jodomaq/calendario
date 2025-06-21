import { getDaysInMonth, getDay } from 'date-fns'

export default function MonthMini({ monthIndex, year, activities, onClick }) {
  const firstDate = new Date(year, monthIndex, 1)
  const daysInMonth = getDaysInMonth(firstDate)
  const startWeekDay = getDay(firstDate) // 0 (Sun) – 6 (Sat)

  // Necesitamos exactamente 35 celdas (7x5) para renderizar en grid
  // Primero, los días vacíos antes del inicio del mes
  // Luego, los días del mes
  // Finalmente, celdas vacías para completar las 35
  
  // Calcular las celdas del calendario
  const cells = [];
  
  // 1. Agregar celdas vacías al inicio para alinear el primer día
  for (let i = 0; i < startWeekDay; i++) {
    cells.push(null);
  }
  
  // 2. Agregar los días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }
  
  // 3. Completar con celdas vacías hasta el final de la fila actual, pero sin añadir filas nuevas
  const currentRowCells = cells.length % 7;
  
  // Solo añadimos celdas si estamos en medio de una fila (no añadimos filas completamente vacías)
  if (currentRowCells > 0) {
    const remainingCells = 7 - currentRowCells;
    for (let i = 0; i < remainingCells; i++) {
      cells.push(null);
    }
  }

  function getColorForDay(day) {
    const date = new Date(year, monthIndex, day)
    const evt = activities.find(
      (a) => a.startDate <= date && a.endDate >= date,
    )
    console.log(evt)
    console.log(evt?.startDate.toLocaleDateString('en-CA'))
    if (evt?.startDate && evt.startDate.toLocaleDateString('en-CA') === '2025-08-18') {
      console.log(evt)
    }
    return evt?.color || 'transparent'
  }

  // Organizar las celdas en filas para mejor control
  const weeks = [];
  let currentWeek = [];
  
  cells.forEach((cell) => {
    currentWeek.push(cell);
    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });
  
  // Si la última semana tiene celdas, agregarla
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <div className="month-mini" onClick={onClick}>
      <div className="month-mini-header">
        {firstDate.toLocaleString('default', { month: 'long' })} - {year}
      </div>
      <div className="calendar-container">
        {/* Cabecera de días de la semana separada */}
        <div className="day-header">
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((s, idx) => (
            <div key={idx} className="dow">
              {s}
            </div>
          ))}
        </div>
        
        {/* Rejilla de días por semanas */}
        <div className="weeks-container">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="week-row">
              {week.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className="day-cell"
                  style={{ backgroundColor: day ? getColorForDay(day) : 'transparent' }}
                >
                  {day && <span>{day}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
