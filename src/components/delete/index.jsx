import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DeletePokemon = () => {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/pokemons")
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
    <div style={{ padding: "40px" }}>
      <h2>Supprimer un Pokémon</h2>

      {/* RETOUR */}
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
      >
        ⬅ Retour
      </button>

      {/* RECHERCHE */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Rechercher un Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* LISTE */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon) => (
            <li
              key={pokemon.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "15px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
              }}
            >
              <img
                src={pokemon.image}
                alt={pokemon.name.french}
                width="60"
              />
              <strong>{pokemon.name.french}</strong>

              <button
                onClick={() => handleDelete(pokemon.id)}
                style={{
                  marginLeft: "auto",
                  background: "#d32f2f",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  cursor: "pointer",
                }}
              >
                Supprimer
              </button>
            </li>
          ))
        ) : (
          <p>Aucun Pokémon trouvé</p>
        )}
      </ul>
    </div>
  );
};

export default DeletePokemon;
