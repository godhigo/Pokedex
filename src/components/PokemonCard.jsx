const nombresTipos = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
}

export function PokemonCard({ pokemon, onAgregar, onQuitar, enEquipo, compacta }) {
  const imagen = pokemon.sprites.other['official-artwork'].front_default
  const nombre = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
  const tipoPrincipal = pokemon.types[0].type.name

  return (
    <article className={`tarjeta tipo-${tipoPrincipal} ${compacta ? 'compacta' : ''}`}>
      <span className="numero">#{String(pokemon.id).padStart(3, '0')}</span>

      <img className="imagen-pokemon" src={imagen} alt={nombre} />

      <h3>{nombre}</h3>

      <div className="tipos">
        {pokemon.types.map(({ type }) => (
          <span key={type.name}>{nombresTipos[type.name]}</span>
        ))}
      </div>

      {!compacta && (
        <div className="datos-pokemon">
          <p>Altura: {pokemon.height / 10} m</p>
          <p>Peso: {pokemon.weight / 10} kg</p>
        </div>
      )}

      {!compacta && !enEquipo && (
        <button className="agregar" onClick={() => onAgregar(pokemon)}>
          Agregar al equipo
        </button>
      )}

      {!compacta && enEquipo && <p className="en-equipo">Ya está en tu equipo</p>}

      {compacta && (
        <button className="quitar" onClick={() => onQuitar(pokemon)}>
          Quitar
        </button>
      )}
    </article>
  )
}
