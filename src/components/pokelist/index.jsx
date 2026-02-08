import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PokeCard from "../pokecard";
import "./index.css";

const PokeList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/pokemons")
      .then((res) => res.json())
      .then((data) => {
        setPokemons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.french.toLowerCase().includes(search.toLowerCase()) ||
    pokemon.name.english.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="pokedex-title">POKEDEX</h2>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher un Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      />

      {/* Bouton ajouter */}
      <div style={{ marginBottom: "30px" }}>
        <Link to="/add">
          <button>➕ Ajouter un Pokémon</button>
        </Link>
      </div>
      
      {/* Bouton supprimer */}
      <div style={{ marginBottom: "30px" }}>
        <Link to="/delete">
          <button>🗑️ Supprimer un Pokémon</button>
        </Link>
      </div>

      {/* Grille */}
      <div className="poke-list">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon) => (
            <PokeCard key={pokemon.id} pokemon={pokemon} />
          ))
        ) : (
          <p>Aucun Pokémon trouvé</p>
        )}
      </div>
    </div>
  );
};

export default PokeList;
