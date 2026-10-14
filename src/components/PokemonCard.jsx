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

export const PokemonCard = ({ pokemon }) => {
  const image =
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.front_default

  return (
    <article className={`tarjeta tipo-${pokemon.types[0].type.name}`}>
      <span className="numero">#{String(pokemon.id).padStart(3, '0')}</span>
      <div className="imagen-pokemon">
        {image && <img src={image} alt={`Ilustración de ${pokemon.name}`} loading="lazy" />}
      </div>
      <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
      <ul className="tipos">
        {pokemon.types.map(({ type }) => (
          <li key={type.name}>{nombresTipos[type.name] ?? type.name}</li>
        ))}
      </ul>
      <div className="datos-pokemon">
        <p><span>Altura</span><strong>{pokemon.height / 10} m</strong></p>
        <p><span>Peso</span><strong>{pokemon.weight / 10} kg</strong></p>
      </div>
    </article>
  )
}
