import './App.css'
import { CalendarProvider, useCalendar } from './context/CalendarContext.jsx'
import AnnualCalendar from './components/AnnualCalendar.jsx'
import MonthlyCalendar from './components/MonthlyCalendar.jsx'
import Header from './components/Header.jsx'

function App() {
  return (
    <CalendarProvider>
      <Header />
      <CalendarContent />
    </CalendarProvider>
  )
}

// Componente para determinar qué vista mostrar basado en el contexto
function CalendarContent() {
  const { view } = useCalendar()
  
  return view.type === 'annual' ? <AnnualCalendar /> : <MonthlyCalendar />
}

export default App
