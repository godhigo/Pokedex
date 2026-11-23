import { useEffect, useState } from 'react'
import { cerrarSesion, escucharSesion, iniciarSesion, registrar } from './data/auth'
import App from './App'
import './LoginDemo.css'

// Traduce los códigos de error de Firebase a algo entendible
const mensajesError = {
  'auth/invalid-email': 'El correo no es válido.',
  'auth/missing-password': 'Escribe tu contraseña.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/email-already-in-use': 'Ese correo ya tiene una cuenta.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'No existe una cuenta con ese correo.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
  'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
  'auth/configuration-not-found': 'Activa Email/Password en Firebase Authentication.',
}

function traducirError(err) {
  return mensajesError[err.code] || err.message || 'Algo salió mal.'
}

function LoginDemo() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verPassword, setVerPassword] = useState(false)
  const [error, setError] = useState('')
  const [usuario, setUsuario] = useState(null)
  const [revisando, setRevisando] = useState(true)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const dejarDeEscuchar = escucharSesion((user) => {
      setUsuario(user)
      setRevisando(false)
    })
    return dejarDeEscuchar
  }, [])

  async function entrar(e) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await iniciarSesion(email, password)
      setPassword('')
    } catch (err) {
      setError(traducirError(err))
    } finally {
      setEnviando(false)
    }
  }

  async function crearCuenta() {
    setError('')
    setEnviando(true)
    try {
      await registrar(email, password)
      setPassword('')
    } catch (err) {
      setError(traducirError(err))
    } finally {
      setEnviando(false)
    }
  }

  async function salir() {
    await cerrarSesion()
    setError('')
  }

  if (revisando) {
    return (
      <div className="login-fondo">
        <div className="login-cargando">
          <div className="pokebola girando" />
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="login-fondo">
        <main className="login-tarjeta">
          <div className="login-cabecera">
            <div className="pokebola" />
            <h1>Pokédex</h1>
            <p>Inicia sesión para continuar</p>
          </div>

          <form className="login-form" onSubmit={entrar}>
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ash@pueblopaleta.com"
              autoComplete="email"
            />

            <label htmlFor="password">Contraseña</label>
            <div className="login-password">
              <input
                type={verPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-ver"
                onClick={() => setVerPassword(!verPassword)}
              >
                {verPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-boton" disabled={enviando}>
              {enviando ? 'Entrando...' : 'Entrar'}
            </button>
            <button
              type="button"
              className="login-boton secundario"
              onClick={crearCuenta}
              disabled={enviando}
            >
              Crear cuenta
            </button>
          </form>
        </main>
      </div>
    )
  }

  // Con sesión iniciada: barra de usuario arriba y la Pokédex abajo
  return (
    <>
      <header className="barra-sesion">
        <div className="barra-contenido">
          <div className="barra-usuario">
            <div className="avatar">{usuario.email.charAt(0).toUpperCase()}</div>
            <span>{usuario.email}</span>
          </div>
          <button className="login-salir" onClick={salir}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <App />
    </>
  )
}

export default LoginDemo
