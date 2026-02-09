import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const UpdatePokemon = () => {
  const { language } = useLanguage(); // hook de langue
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [shinyError, setShinyError] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch(`http://localhost:3000/pokemons/${id}`);
        const data = await res.json();
        setPokemon(data);
      } catch (err) {
        console.error(err);
        alert(language === "fr" ? "Erreur lors du chargement du Pokémon" : "Error loading Pokémon");
      }
    };
    fetchPokemon();
  }, [id, language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!pokemon) return;
    if (Object.keys(pokemon.base).includes(name)) {
      setPokemon({ ...pokemon, base: { ...pokemon.base, [name]: Number(value) } });
    } else if (Object.keys(pokemon.name).includes(name)) {
      setPokemon({ ...pokemon, name: { ...pokemon.name, [name]: value } });
    } else if (name === "image") {
      setImageError(false);
      setPokemon({ ...pokemon, image: value });
    } else if (name === "shiny") {
      setShinyError(false);
      setPokemon({ ...pokemon, shiny: value });
    }
  };

  const toggleType = (type) => {
    if (!pokemon) return;
    let newTypes = [...pokemon.type];
    if (newTypes.includes(type)) newTypes = newTypes.filter((t) => t !== type);
    else if (newTypes.length < 2) newTypes.push(type);
    setPokemon({ ...pokemon, type: newTypes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pokemon.image || !pokemon.shiny || Object.values(pokemon.name).some(v => v.trim() === "")) {
      alert(language === "fr" ? "Veuillez remplir tous les champs de nom et images" : "Please fill all name fields and images");
      return;
    }
    if (pokemon.type.length === 0) {
      alert(language === "fr" ? "Veuillez sélectionner au moins un type (max 2)" : "Please select at least one type (max 2)");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/pokemons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pokemon),
      });
      if (res.ok) navigate("/");
      else alert(language === "fr" ? "Erreur lors de la mise à jour du Pokémon" : "Error updating Pokémon");
    } catch (err) {
      console.error(err);
      alert(language === "fr" ? "Erreur serveur" : "Server error");
    }
  };

  if (!pokemon) return <p>{language === "fr" ? "Chargement..." : "Loading..."}</p>;

  return (
    <div className="update-container">
      <div className="update-card">
        <h2>{language === "fr" ? "Modifier le Pokémon" : "Update Pokémon"}</h2>
        <button className="back-button" onClick={() => navigate(-1)}>
          {language === "fr" ? "Retour" : "Back"}
        </button>

        <form onSubmit={handleSubmit}>
          {/* Noms */}
          {Object.keys(pokemon.name).map(lang => (
            <div key={lang} className="input-group">
              <label>
                {language === "fr" ? "Nom" : "Name"} ({lang})
              </label>
              <input type="text" name={lang} value={pokemon.name[lang]} onChange={handleChange} required />
            </div>
          ))}

          {/* Types */}
          <h3>{language === "fr" ? "Types (max 2)" : "Types (max 2)"}</h3>
          <div className="type-selector">
            {Object.keys(TYPE_IMAGES).map(type => (
              <img
                key={type}
                src={TYPE_IMAGES[type]}
                alt={type}
                className={`type-image ${pokemon.type.includes(type) ? "selected" : ""}`}
                onClick={() => toggleType(type)}
              />
            ))}
          </div>

          {/* Stats */}
          <h3>{language === "fr" ? "Stats" : "Stats"}</h3>
          {Object.keys(pokemon.base).map(stat => (
            <div key={stat} className="stat-group">
              <label>{stat}</label>
              <input type="range" min="1" max="255" name={stat} value={pokemon.base[stat]} onChange={handleChange} />
              <span>{pokemon.base[stat]}</span>
            </div>
          ))}

          {/* Image normale */}
          <h3>{language === "fr" ? "Image normale" : "Normal image"}</h3>
          <input type="text" name="image" value={pokemon.image} onChange={handleChange} required />
          {pokemon.image && (
            <div className="image-preview">
              {!imageError ? (
                <img src={pokemon.image} alt="Preview Pokémon" onError={() => setImageError(true)} />
              ) : (
                <p className="image-error">
                  {language === "fr" ? "Impossible de charger l'image" : "Cannot load image"}
                </p>
              )}
            </div>
          )}

          {/* Image shiny */}
          <h3>{language === "fr" ? "Image shiny" : "Shiny image"}</h3>
          <input type="text" name="shiny" value={pokemon.shiny} onChange={handleChange} required />
          {pokemon.shiny && (
            <div className="image-preview">
              {!shinyError ? (
                <img src={pokemon.shiny} alt="Preview Shiny" onError={() => setShinyError(true)} />
              ) : (
                <p className="image-error">
                  {language === "fr" ? "Impossible de charger l'image shiny" : "Cannot load shiny image"}
                </p>
              )}
            </div>
          )}

          <button type="submit" className="submit-button">
            {language === "fr" ? "Sauvegarder" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePokemon;
