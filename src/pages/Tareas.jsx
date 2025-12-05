import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'


const TASKS_KEY = 'cloudhw-tasks'
const EVENTS_KEY = 'cloudhw-events'

function Tareas() {
  const navigate = useNavigate()
  
  const [tasks, setTasks] = useState([])
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newTaskMateria, setNewTaskMateria] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskDate, setNewTaskDate] = useState('') 

  const [isFileModalOpen, setIsFileModalOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    if (localStorage.getItem('cloudhw-loggedin') !== 'true') {
      navigate('/login')
    }
    
    const savedTasks = localStorage.getItem(TASKS_KEY)
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [navigate])

  const handleCreateTask = (e) => {
    e.preventDefault()
    if (!newTaskMateria || !newTaskDesc || !newTaskDate) {
      alert("Por favor completa todos los campos")
      return
    }

    
    const newTask = {
      id: Date.now(),
      materia: newTaskMateria,
      descripcion: newTaskDesc,
      fechaLimite: `Fecha límite: ${newTaskDate.split('-').reverse().join('/')}`, 
      fechaRaw: newTaskDate, 
      completada: false,
      archivo: null 
    }

    
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks))

    
    const [y, m, d] = newTaskDate.split('-').map(Number)
    const calendarKey = `${y}-${m - 1}-${d}`

    const existingEvents = JSON.parse(localStorage.getItem(EVENTS_KEY) || '{}')
    const dayEvents = existingEvents[calendarKey] || []
    
    const newEventTitle = `${newTaskMateria}: ${newTaskDesc}`
    const updatedEvents = {
      ...existingEvents,
      [calendarKey]: [...dayEvents, newEventTitle]
    }
    
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents))

    setNewTaskMateria('')
    setNewTaskDesc('')
    setNewTaskDate('')
    setIsCreateModalOpen(false)
  }

  //Función para SUBIR ARCHIVO
  const openFileUpload = (taskId) => {
    setSelectedTaskId(taskId)
    setSelectedFile(null)
    setIsFileModalOpen(true)
  }

  const handleUploadFile = (e) => {
    e.preventDefault()
    if (!selectedFile) return

    const updatedTasks = tasks.map(task => {
      if (task.id === selectedTaskId) {
        return { ...task, archivo: selectedFile.name } 
      }
      return task
    })

    setTasks(updatedTasks)
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks))
    
    alert(`Archivo "${selectedFile.name}" subido correctamente a la tarea.`)
    setIsFileModalOpen(false)
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <div className="main-header">
          <h1>Mis Tareas</h1>
          <button className="add-course-btn" onClick={() => setIsCreateModalOpen(true)}>
            + Nueva Tarea
          </button>
        </div>

        <div className="tasks-container">
          {tasks.length > 0 ? (
            <ul className="task-full-list">
              {tasks.map(task => (
                <li key={task.id} className="task-full-item">
                  <div className="task-info">
                    <h3>{task.materia}</h3>
                    <p>{task.descripcion}</p>
                    <span className="task-date">📅 {task.fechaLimite}</span>
                    
                    
                    {task.archivo && (
                      <div className="file-badge">
                        📎 {task.archivo}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="upload-btn" 
                    onClick={() => openFileUpload(task.id)}
                  >
                    {task.archivo ? 'Cambiar Archivo' : 'Subir Entrega'}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
             <div className="empty-state">
              <p>No hay tareas pendientes.</p>
            </div>
          )}
        </div>
      </main>

      {/*CREAR TAREA */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Agregar Nueva Tarea</h2>
            <form onSubmit={handleCreateTask} className="modal-form">
              <label>Materia:</label>
              <input type="text"  value={newTaskMateria} onChange={e => setNewTaskMateria(e.target.value)} />
              
              <label>Descripción:</label>
              <input type="text" value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} />
              
              <label>Fecha de Entrega:</label>
              <input type="date" value={newTaskDate} onChange={e => setNewTaskDate(e.target.value)} />
              
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Crear Tarea</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*SUBIR ARCHIVO */}
      {isFileModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsFileModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Subir Archivo</h2>
            <form onSubmit={handleUploadFile} className="modal-form">
              <input 
                type="file" 
                onChange={(e) => setSelectedFile(e.target.files[0])} 
              />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsFileModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Subir</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tareas