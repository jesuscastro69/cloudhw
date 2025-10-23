import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    //usuario guardado
    const storedUser = localStorage.getItem('cloudhw-user')

    if (storedUser) {
      const user = JSON.parse(storedUser)

      
      if (email === user.email && password === user.password) {
        //Simulacion de sesion iniciada
        localStorage.setItem('cloudhw-loggedin', 'true')
        localStorage.setItem('cloudhw-username', user.username)
        navigate('/') 
      } else {
        alert('Correo o contraseña incorrectos.')
      }
    } else {
      alert('No se encontró ningún usuario. Por favor, regístrate.')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="CloudHW Logo" className="auth-logo" />
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
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
            Iniciar Sesión
          </button>
        </form>
        <p className="auth-link">
          ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}

export default Login