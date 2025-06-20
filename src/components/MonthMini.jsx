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
  
  // 3. Completar con celdas vacías hasta el final (múltiplo de 7)
  const remainingCells = (7 - (cells.length % 7)) % 7;
  for (let i = 0; i < remainingCells; i++) {
    cells.push(null);
  }
  
  function getColorForDay(day) {
    const date = new Date(year, monthIndex, day)
    const evt = activities.find(
      (a) => a.startDate <= date && a.endDate >= date,
    )
    return evt?.color || 'transparent'
  }

  return (
    <div className="month-mini" onClick={onClick}>
      <div className="month-mini-header">
        {firstDate.toLocaleString('default', { month: 'long' })} - {year}
      </div>
      <div className="day-grid">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((s, idx) => (
          <div key={idx} className="dow">
            {s}
          </div>
        ))}
        {cells.map((cell, idx) => (
          <div
            key={idx}
            className="day-cell"
            style={{ backgroundColor: cell ? getColorForDay(cell) : 'transparent' }}
          >
            {cell && <span>{cell}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
