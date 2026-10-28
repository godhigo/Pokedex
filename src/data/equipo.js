import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

export async function cargarEquipo() {
  const datos = await getDocs(collection(db, 'equipo'))
  return datos.docs.map((pokemon) => pokemon.data())
}

export async function guardarPokemon(pokemon) {
  await setDoc(doc(db, 'equipo', String(pokemon.id)), pokemon)
}

export async function eliminarPokemon(id) {
  await deleteDoc(doc(db, 'equipo', String(id)))
}
