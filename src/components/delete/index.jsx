import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const DeletePokemon = () => {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/pokemons/all")
      .then((res) => res.json())
      .then((data) => setPokemons(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Es-tu sûr de vouloir supprimer ce Pokémon ?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/pokemons/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setPokemons(pokemons.filter((p) => p.id !== id));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  // 🔍 Filtrage
  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.french.toLowerCase().includes(search.toLowerCase()) ||
    pokemon.name.english.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="delete-container">
      <h2>Supprimer un Pokémon</h2>

      {/* RETOUR */}
      <button className="back-button" onClick={() => navigate(-1)}>
        ⬅ Retour
      </button>

      {/* RECHERCHE */}
      <input
        type="text"
        placeholder="Rechercher un Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* LISTE */}
      <div className="pokemon-list">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon) => (
            <div key={pokemon.id} className="pokemon-card">
              <img
                src={pokemon.image}
                alt={pokemon.name.french}
                className="pokemon-img"
              />
              <strong className="pokemon-name">{pokemon.name.french}</strong>
              <button
                className="delete-button"
                onClick={() => handleDelete(pokemon.id)}
              >
                Supprimer
              </button>
            </div>
          ))
        ) : (
          <p className="no-pokemon">Aucun Pokémon trouvé</p>
        )}
      </div>
    </div>
  );
};

export default DeletePokemon;
