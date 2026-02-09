import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../LanguageContext";
import "./index.css";

const TYPE_IMAGES = {
  Normal: "http://localhost:3000/assets/types/1.png",
  Fighting: "http://localhost:3000/assets/types/2.png",
  Flying: "http://localhost:3000/assets/types/3.png",
  Poison: "http://localhost:3000/assets/types/4.png",
  Ground: "http://localhost:3000/assets/types/5.png",
  Rock: "http://localhost:3000/assets/types/6.png",
  Bug: "http://localhost:3000/assets/types/7.png",
  Ghost: "http://localhost:3000/assets/types/8.png",
  Steel: "http://localhost:3000/assets/types/9.png",
  Fire: "http://localhost:3000/assets/types/10.png",
  Water: "http://localhost:3000/assets/types/11.png",
  Grass: "http://localhost:3000/assets/types/12.png",
  Electric: "http://localhost:3000/assets/types/13.png",
  Psychic: "http://localhost:3000/assets/types/14.png",
  Ice: "http://localhost:3000/assets/types/15.png",
  Dragon: "http://localhost:3000/assets/types/16.png",
  Dark: "http://localhost:3000/assets/types/17.png",
  Fairy: "http://localhost:3000/assets/types/18.png",
};

const PokeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/pokemons/${id}`)
      .then((res) => res.json())
      .then((data) => setPokemon(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!pokemon) return <p>{language === "fr" ? "Chargement..." : "Loading..."}</p>;

  const shinyImage = pokemon.shiny || `http://localhost:3000/assets/pokemons/shiny/${pokemon.id}.png`;

  const handleDelete = async () => {
    const confirmMessage =
      language === "fr"
        ? `Voulez-vous vraiment supprimer ${pokemon.name.french} ?`
        : `Do you really want to delete ${pokemon.name.english}?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const res = await fetch(`http://localhost:3000/pokemons/${pokemon.id}`, {
        method: "DELETE",
      });
      if (res.ok) navigate("/");
      else alert(language === "fr" ? "Erreur lors de la suppression" : "Error deleting Pokémon");
    } catch (err) {
      console.error(err);
      alert(language === "fr" ? "Erreur serveur" : "Server error");
    }
  };

  const handleUpdate = () => {
    navigate(`/update/${pokemon.id}`);
  };

  return (
    <div className="pokedex-container">
      <div className="pokedex-card">
        <button className="back-button" onClick={() => navigate(-1)}>
          {language === "fr" ? "Retour au Pokédex" : "Back to Pokédex"}
        </button>

        <div className="pokedex-header">
          <h1>{language === "fr" ? pokemon.name.french : pokemon.name.english}</h1>
          <span># {pokemon.id}</span>
        </div>

        <div className="pokedex-images">
          <div>
            <p>{language === "fr" ? "Normal" : "Normal"}</p>
            <img src={pokemon.image} alt={pokemon.name.french} />
          </div>
          <div>
            <p>Shiny</p>
            <img src={shinyImage} alt={`${pokemon.name.french} shiny`} />
          </div>
        </div>

        <div className="pokedex-types">
          {pokemon.type.map((type) => (
            <img key={type} src={TYPE_IMAGES[type]} alt={type} className="type-image" />
          ))}
        </div>

        <div className="pokedex-stats">
          {Object.entries(pokemon.base).map(([stat, value]) => (
            <div key={stat} className="stat-line">
              <span>{stat}</span>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: `${(value / 255) * 100}%` }} />
              </div>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <div className="pokedex-buttons">
          <button className="action-button" onClick={handleUpdate}>
            {language === "fr" ? "Mettre à jour" : "Update"}
          </button>
          <button className="action-button delete-button" onClick={handleDelete}>
            {language === "fr" ? "Supprimer" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokeDetails;
