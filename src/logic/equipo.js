export const MAX_EQUIPO = 6

export function estaEnEquipo(equipo, id) {
  return equipo.some((pokemon) => pokemon.id === id)
}

export function equipoLleno(equipo) {
  return equipo.length >= MAX_EQUIPO
}

export function agregarPokemon(equipo, pokemon) {
  if (equipoLleno(equipo)) return equipo
  if (estaEnEquipo(equipo, pokemon.id)) return equipo

  return [...equipo, pokemon]
}

export function quitarPokemon(equipo, id) {
  return equipo.filter((pokemon) => pokemon.id !== id)
}

export function prepararPokemon(pokemon) {
  return {
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    sprites: pokemon.sprites,
    types: pokemon.types,
  }
}
