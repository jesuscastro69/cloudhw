import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png' 

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username && email && password) {
      // simulacion guardar usuario en local
      const user = { username, email, password }
      localStorage.setItem('cloudhw-user', JSON.stringify(user))
      
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.')
      navigate('/login') 
    } else {
      alert('Por favor, completa todos los campos.')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="CloudHW Logo" className="auth-logo" />
        <h2>Registro de Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span>👤</span>
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span>📧</span>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span>🔒</span>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-btn">
            Registrarse
          </button>
        </form>
        <p className="auth-link">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  )
}

export default Register