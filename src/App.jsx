import { useEffect, useState } from 'react'
import { PokemonCard } from './components/PokemonCard'
import { cargarEquipo, eliminarPokemon, guardarPokemon } from './data/equipo'
import { buscarPokemon, cargarPokemones, LIMITE } from './data/pokemones'
import {
  agregarPokemon,
  equipoLleno,
  estaEnEquipo,
  prepararPokemon,
  quitarPokemon,
} from './logic/equipo'

function App() {
  const [pokemones, setPokemones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [equipo, setEquipo] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [modoBusqueda, setModoBusqueda] = useState(false)
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    async function obtenerEquipo() {
      try {
        const lista = await cargarEquipo()
        setEquipo(lista)
      } catch (error) {
        console.log('No se pudo cargar el equipo:', error)
      }
    }

    obtenerEquipo()
  }, [])

  useEffect(() => {
    if (modoBusqueda) return

    async function obtenerPokemones() {
      try {
        setCargando(true)
        setError(null)

        const datos = await cargarPokemones(offset)
        setPokemones(datos.pokemones)
        setTotal(datos.total)
      } catch (error) {
        setError(error.message)
      } finally {
        setCargando(false)
      }
    }

    obtenerPokemones()
  }, [offset, modoBusqueda])

  async function manejarBusqueda(evento) {
    evento.preventDefault()

    const texto = busqueda.trim().toLowerCase()
    if (texto === '') return

    try {
      setModoBusqueda(true)
      setCargando(true)
      setError(null)

      const pokemon = await buscarPokemon(texto)
      setPokemones([pokemon])
    } catch (error) {
      setError(error.message)
    } finally {
      setCargando(false)
    }
  }

  function verTodos() {
    setBusqueda('')
    setOffset(0)
    setModoBusqueda(false)
    setError(null)
  }

  async function agregarAlEquipo(pokemon) {
    if (equipoLleno(equipo)) {
      setMensaje('Tu equipo ya tiene 6 Pokémon.')
      return
    }

    if (estaEnEquipo(equipo, pokemon.id)) {
      setMensaje('Ese Pokémon ya está en tu equipo.')
      return
    }

    const nuevoPokemon = prepararPokemon(pokemon)
    const nuevoEquipo = agregarPokemon(equipo, nuevoPokemon)

    try {
      await guardarPokemon(nuevoPokemon)
      setEquipo(nuevoEquipo)
      setMensaje(`${pokemon.name} fue agregado al equipo.`)
    } catch (error) {
      console.log(error)
      setMensaje('No se pudo guardar el Pokémon.')
    }
  }

  async function quitarDelEquipo(pokemon) {
    try {
      await eliminarPokemon(pokemon.id)
      setEquipo(quitarPokemon(equipo, pokemon.id))
      setMensaje(`${pokemon.name} fue eliminado del equipo.`)
    } catch (error) {
      console.log(error)
      setMensaje('No se pudo quitar el Pokémon.')
    }
  }

  const paginaActual = Math.floor(offset / LIMITE) + 1
  const totalPaginas = Math.ceil(total / LIMITE)

  return (
    <main className="app">
      <header className="encabezado">
        <h1>Pokédex</h1>
        <p>Busca Pokémon y arma un equipo de hasta 6 integrantes.</p>

        <form className="buscador" onSubmit={manejarBusqueda}>
          <input
            type="text"
            placeholder="Ej. pikachu o 25"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
          <button type="submit">Buscar</button>
          {modoBusqueda && (
            <button type="button" className="boton-secundario" onClick={verTodos}>
              Ver todos
            </button>
          )}
        </form>
      </header>

      <section className="seccion-equipo">
        <h2>Mi equipo ({equipo.length}/6)</h2>

        {equipo.length === 0 ? (
          <p className="vacio">Todavía no has agregado ningún Pokémon.</p>
        ) : (
          <div className="equipo">
            {equipo.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onQuitar={quitarDelEquipo}
                compacta
              />
            ))}
          </div>
        )}

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </section>

      <section className="seccion-pokedex">
        <div className="titulo-lista">
          <h2>{modoBusqueda ? 'Resultado de búsqueda' : 'Pokémon'}</h2>
          {!modoBusqueda && (
            <span>
              Página {paginaActual} de {totalPaginas || 1}
            </span>
          )}
        </div>

        {cargando && <p className="estado">Cargando...</p>}
        {error && <p className="error">{error}</p>}

        {!cargando && !error && (
          <div className="rejilla-pokemon">
            {pokemones.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onAgregar={agregarAlEquipo}
                enEquipo={estaEnEquipo(equipo, pokemon.id)}
              />
            ))}
          </div>
        )}

        {!modoBusqueda && !cargando && (
          <div className="paginacion">
            <button
              disabled={offset === 0}
              onClick={() => setOffset(offset - LIMITE)}
            >
              Anterior
            </button>

            <button
              disabled={offset + LIMITE >= total}
              onClick={() => setOffset(offset + LIMITE)}
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
