import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../LanguageContext";
import "./index.css";

const TEXT = {
  fr: {
    title: "Supprimer un Pokémon",
    back: "⬅ Retour",
    searchPlaceholder: "Rechercher un Pokémon...",
    deleteButton: "Supprimer",
    noPokemon: "Aucun Pokémon trouvé",
    confirm: "Es-tu sûr de vouloir supprimer ce Pokémon ?",
  },
  en: {
    title: "Delete a Pokemon",
    back: "⬅ Back",
    searchPlaceholder: "Search a Pokemon...",
    deleteButton: "Delete",
    noPokemon: "No Pokemon found",
    confirm: "Are you sure you want to delete this Pokemon?",
  },
};

const LANG_MAP = { fr: "french", en: "english" };

const DeletePokemon = () => {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = TEXT[language];
  const langKey = LANG_MAP[language];

  useEffect(() => {
    fetch("http://localhost:3000/pokemons/all")
      .then((res) => res.json())
      .then((data) => setPokemons(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirm)) return;

    try {
      const response = await fetch(`http://localhost:3000/pokemons/${id}`, { method: "DELETE" });
      if (response.ok) setPokemons(pokemons.filter((p) => p.id !== id));
      else alert("Erreur lors de la suppression");
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name[langKey].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="delete-container">
      <h2>{t.title}</h2>

      <button className="back-button" onClick={() => navigate(-1)}>
        {t.back}
      </button>

      <input
        type="text"
        placeholder={t.searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <div className="pokemon-list">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon) => (
            <div key={pokemon.id} className="pokemon-card">
              <img src={pokemon.image} alt={pokemon.name[langKey]} className="pokemon-img" />
              <strong className="pokemon-name">{pokemon.name[langKey]}</strong>
              <button
                className="delete-button"
                onClick={() => handleDelete(pokemon.id)}
              >
                {t.deleteButton}
              </button>
            </div>
          ))
        ) : (
          <p className="no-pokemon">{t.noPokemon}</p>
        )}
      </div>
    </div>
  );
};

export default DeletePokemon;
