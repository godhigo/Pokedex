
import { describe, it, expect } from 'vitest'
import {
  estaEnEquipo,
  equipoLleno,
  agregarPokemon,
  quitarPokemon,
  prepararPokemon,
} from '../logic/equipo'

describe('Pruebas del equipo Pokémon', () => {
  const pikachu = { id: 25, name: 'pikachu' }
  const bulbasaur = { id: 1, name: 'bulbasaur' }

  it('revisa si un Pokémon ya está en el equipo', () => {
    const equipo = [pikachu]

    expect(estaEnEquipo(equipo, 25)).toBe(true)
    expect(estaEnEquipo(equipo, 1)).toBe(false)
  })

  it('revisa si el equipo está lleno', () => {
    const equipo = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }]

    expect(equipoLleno(equipo)).toBe(true)
    expect(equipoLleno([pikachu])).toBe(false)
  })

  it('agrega un Pokémon nuevo al equipo', () => {
    const equipo = [bulbasaur]
    const nuevoEquipo = agregarPokemon(equipo, pikachu)

    expect(nuevoEquipo).toEqual([bulbasaur, pikachu])
    expect(equipo).toEqual([bulbasaur])
  })

  it('no agrega Pokémon repetidos', () => {
    const equipo = [pikachu]

    expect(agregarPokemon(equipo, pikachu)).toEqual([pikachu])
  })

  it('no agrega Pokémon si el equipo ya tiene seis', () => {
    const equipo = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }]

    expect(agregarPokemon(equipo, pikachu)).toEqual(equipo)
  })

  it('quita un Pokémon del equipo', () => {
    const equipo = [bulbasaur, pikachu]

    expect(quitarPokemon(equipo, 25)).toEqual([bulbasaur])
  })

  it('prepara los datos necesarios del Pokémon', () => {
    const pokemon = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: { front_default: 'pikachu.png' },
      types: [{ type: { name: 'electric' } }],
      habilidadExtra: 'static',
    }

    const resultado = prepararPokemon(pokemon)

    expect(resultado).toEqual({
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: pokemon.sprites,
      types: pokemon.types,
    })
  })
})
