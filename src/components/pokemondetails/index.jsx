import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PokemonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/pokemons/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemon(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!pokemon) return <p>Pokémon introuvable</p>;

  return (
    <div style={{ padding: "40px" }}>
      {/* BOUTON RETOUR */}
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        Retour
      </button>

      {/* NOM ET IMAGE */}
      <h1>{pokemon.name.french}</h1>
      <img
        src={pokemon.image}
        alt={pokemon.name.french}
        style={{ width: "300px" }}
      />

      {/* TYPES */}
      <h3>Types</h3>
      <p>{pokemon.type.join(", ")}</p>

      {/* STATISTIQUES */}
      <h3>Statistiques</h3>
      <ul>
        {Object.entries(pokemon.base).map(([stat, value]) => (
          <li key={stat}>
            {stat} : {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonDetails;