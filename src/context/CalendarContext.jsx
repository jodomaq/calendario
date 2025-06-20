import { createContext, useContext, useEffect, useState } from 'react'
import CalendarService from '../services/CalendarService.js'

const CalendarContext = createContext()

export function CalendarProvider({ children }) {
  const [config, setConfig] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState({ type: 'annual', year: null, month: null })

  useEffect(() => {
    async function loadData() {
      try {
        const cfg = await CalendarService.loadConfig()
        const acts = await CalendarService.loadActivities()
        setConfig(cfg)
        setActivities(acts)
        setView({ type: 'annual', year: cfg.startYear })
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const value = {
    config,
    activities,
    loading,
    error,
    view,
    setView,
  }

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
}

export function useCalendar() {
  return useContext(CalendarContext)
}
