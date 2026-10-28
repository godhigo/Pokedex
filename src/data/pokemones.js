const API = 'https://pokeapi.co/api/v2/pokemon'

export const LIMITE = 20

export async function cargarPokemones(offset) {
  const respuesta = await fetch(`${API}?limit=${LIMITE}&offset=${offset}`)

  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar los Pokémon.')
  }

  const datos = await respuesta.json()

  const pokemones = await Promise.all(
    datos.results.map(async (pokemon) => {
      const respuestaPokemon = await fetch(pokemon.url)
      return respuestaPokemon.json()
    }),
  )

  return {
    pokemones,
    total: datos.count,
  }
}

export async function buscarPokemon(nombre) {
  const respuesta = await fetch(`${API}/${nombre}`)

  if (!respuesta.ok) {
    throw new Error('Pokémon no encontrado.')
  }

  return respuesta.json()
}
