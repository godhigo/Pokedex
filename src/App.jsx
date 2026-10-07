import { useState, useEffect } from 'react'
import { PokemonCard } from './components/PokemonCard'
import './App.css'

const API = "https://pokeapi.co/v2/pokemon"

function App() {
  const [pokemon,setPokemon] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      setError(null)
      try{
        const res = await fetch(`${API}/pokemon/pikachu`)
        if (!res.ok) throw new Error(`Pokemon no encontrado(${res.status})`)
          const data = await res.json()
          setPokemon(data)
        } catch (err) {
          setError(err.message)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  console.log("render")

  return (
    <>
      <h1>Pokedex</h1>
      {cargando && <p>Cargando...</p>}
      {error && <p className='error'>{error}</p>}
      {pokemon && !cargando && !error && <PokemonCard pokemon={pokemon}/>}
    </>
  )
}

export default App
