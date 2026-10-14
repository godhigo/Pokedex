import { useEffect, useState } from 'react'
import { PokemonCard } from './components/PokemonCard'
import { initializeApp } from "firebase/app";
import './App.css'

const API = 'https://pokeapi.co/api/v2/pokemon'

function App() {
  const [pokemones, setPokemones] = useState([]) //Guardamos todos los pokemon que lleguen
  const [cargando, setCargando] = useState(true) // Empieza en True o sea "si, estoy cargando"
  const [error, setError] = useState(null) // Empieza en null, que significa que aun no tenemos un error para mostrar

  useEffect(() => {  
    async function cargarPokemones() { 
      try {
        setCargando(true)
        setError(null)

        // Primero obtenemos la lista de Pokemon
        const respuesta = await fetch(`${API}?limit=20&offset=0`)
        //fetch hace la peticion, await espera a que llegue la respuesta antes de continuar, respuesta guarda la respuesta recibida del servidor, ${API} inserta la direccion que guardamos anteriormente, le ponemos limite de 20 y empezamos desde el primer resultado (offset)
        if (!respuesta.ok) throw new Error('No se pudo obtener la lista de Pokémon.')
        //Comprobacion de que la peticion tuvo una respuesta HTTP exitosa. Si no la tuvo, genera un error para manejarlo.

        const lista = await respuesta.json()
        //Enviamos la informacion en formato JSON

        // Después pedimos los datos completos de cada Pokemon
        const detalles = await Promise.all( //INiciamos todas las busquedas sin esperar a que una termine despues de otra
          lista.results.map(async (pokemon) => { //Recorremos el arreglo y creamos uno nuevo con el resultado de transformar cada elemento
            const res = await fetch(pokemon.url) //Cada pokemon tiene su propia URL. Aqui utilizo la direccion de ese pokemon para obtener todos sus datos
            if (!res.ok) throw new Error(`No se pudieron cargar los datos de ${pokemon.name}.`)
            return res.json() //Convertimos esa respuesta a un objeto de Javascript y lo devolvemos como resultado de la funcion
          })
        )

        setPokemones(detalles)
      } catch (err) {
        setError(err.message || 'Ocurrió un error al cargar los Pokémon.')
      } finally {
        setCargando(false)
      }
    }

    cargarPokemones()
  }, []) // Lo dejo vacio para que react lo ejecute al montar el componente, en lugar de repetirlo por cada cambio de estado

  return (
    <main className="app">
      <header className="encabezado">
        <h1>Pokédex</h1>
        <p className="subtitulo">Explora los primeros Pokémon y descubre sus características.</p>
      </header>

      {cargando && <p className="estado">Cargando Pokémon...</p>}
      {error && <p className="error">{error}</p>}

      {!cargando && !error && (
        <>
          <p className="contador">Mostrando {pokemones.length} Pokémon</p>
          <section className="rejilla-pokemon" aria-label="Lista de Pokémon">
            {pokemones.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </section>
        </>
      )}
    </main>
  )
}

export default App
