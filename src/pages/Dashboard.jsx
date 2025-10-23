import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'


const initialTasksData = [
  { id: 1, materia: 'Computo en la nube', descripcion: 'Practica 4', fechaLimite: 'Fecha límite: 24/10', completada: false },
  { id: 2, materia: 'Practicas Profesionales', descripcion: 'Revision de informes', fechaLimite: 'Fecha  23/10', completada: false },
]


const TASKS_STORAGE_KEY = 'cloudhw-tasks'

function Dashboard() {
  const navigate = useNavigate()

 
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('cloudhw-loggedin')
    if (isLoggedIn !== 'true') {
      navigate('/login')
    }
  }, [navigate])

  
  useEffect(() => {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      
      setTasks(initialTasksData)
    }
    setIsLoading(false)
  }, []) 

  
  useEffect(() => {
    if (!isLoading) { 
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
    }
  }, [tasks, isLoading]) 

 
  const handleToggleTask = (id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completada: !task.completada } : task
      )
    )
  }
  
  
  if (isLoading) {
    return (
      <div className="layout">
        <Navbar />
        <main className="main-content">
          <h1>Cargando...</h1>
        </main>
      </div>
    )
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        
        
        <div className="widget-card">
          <h3>Tareas Pendientes</h3>
          
          
          <ul className="task-list">
            {tasks.map(task => (
              <li 
                className={`task-item ${task.completada ? 'completed' : ''}`} 
                key={task.id}
              >
                <input
                  type="checkbox"
                  id={`task-${task.id}`}
                  checked={task.completada}
                  onChange={() => handleToggleTask(task.id)}
                />
                <label htmlFor={`task-${task.id}`}>
                  <strong>{task.materia}</strong> - {task.descripcion}
                  {task.fechaLimite && <span>{task.fechaLimite}</span>}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="widget-card">
          <h3>Próximos Eventos</h3>
          <ul className="event-list">
            <li className="event-item">
              <span className="event-icon">🗓️</span>
              <div className="event-details">
                <strong>Tutorías</strong>
                <span>23/10 - 17:00</span>
              </div>
            </li>
            <li className="event-item">
              <span className="event-icon">🗓️</span>
              <div className="event-details">
                <strong>Examen</strong>
                <span>24/10 - 18:00</span>
              </div>
            </li>
          </ul>
        </div>
        
      </main>
    </div>
  )
}

export default Dashboard