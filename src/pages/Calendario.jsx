import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const EVENTS_STORAGE_KEY = 'cloudhw-events'

function Calendario() {
  const navigate = useNavigate()
  
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const [events, setEvents] = useState({})
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDateKey, setSelectedDateKey] = useState(null) 
  const [newEventTitle, setNewEventTitle] = useState('')

  useEffect(() => {
    if (localStorage.getItem('cloudhw-loggedin') !== 'true') {
      navigate('/login')
    }
  }, [navigate])

  useEffect(() => {
    const savedEvents = localStorage.getItem(EVENTS_STORAGE_KEY)
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }
  }, [])

  useEffect(() => {
    if (Object.keys(events).length > 0) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events))
    }
  }, [events])

  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay() // 0 = Domingo

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  const changeMonth = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1))
  }

  // --- MANEJO DE EVENTOS ---
  const handleDayClick = (day) => {
    const dateKey = `${year}-${month}-${day}`
    setSelectedDateKey(dateKey)
    setNewEventTitle('')
    setIsModalOpen(true)
  }

  const handleSaveEvent = (e) => {
    e.preventDefault()
    if (!newEventTitle) return

    const currentEvents = events[selectedDateKey] || []
    const updatedEvents = {
      ...events,
      [selectedDateKey]: [...currentEvents, newEventTitle]
    }

    setEvents(updatedEvents)
    setIsModalOpen(false)
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        
        
        <div className="calendar-header">
          <button onClick={() => changeMonth(-1)}>❮ Anterior</button>
          <h2>{monthNames[month]} {year}</h2>
          <button onClick={() => changeMonth(1)}>Siguiente ❯</button>
        </div>

        
        <div className="calendar-grid">
          <div className="weekday">Dom</div>
          <div className="weekday">Lun</div>
          <div className="weekday">Mar</div>
          <div className="weekday">Mié</div>
          <div className="weekday">Jue</div>
          <div className="weekday">Vie</div>
          <div className="weekday">Sáb</div>

          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateKey = `${year}-${month}-${day}`
            const dayEvents = events[dateKey] || []
            
            // Verificar si es hoy
            const today = new Date()
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

            return (
              <div 
                key={day} 
                className={`calendar-day ${isToday ? 'today' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <span className="day-number">{day}</span>
                <div className="day-events">
                  {dayEvents.map((evt, index) => (
                    <div key={index} className="event-dot" title={evt}>
                      {evt}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Agregar Evento</h3>
            <p>Para el día: {selectedDateKey}</p>
            <form onSubmit={handleSaveEvent} className="modal-form">
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                autoFocus
              />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendario