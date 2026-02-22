import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const TEXT = {
  fr: {
    title: "Ajouter un Pokémon",
    back: "Retour",
    typeTitle: "Types (max 2)",
    statsTitle: "Stats",
    imageNormal: "Image normale (URL)",
    imageShiny: "Image shiny (URL)",
    submit: "Ajouter le Pokémon",
    fillFields: "Veuillez remplir tous les champs de nom et fournir les images (normale et shiny).",
    selectType: "Veuillez sélectionner au moins un type (max 2).",
    imgError: "Impossible de charger l'image",
  },
  en: {
    title: "Add a Pokemon",
    back: "Back",
    typeTitle: "Types (max 2)",
    statsTitle: "Stats",
    imageNormal: "Normal image (URL)",
    imageShiny: "Shiny image (URL)",
    submit: "Add Pokemon",
    fillFields: "Please fill all name fields and provide both images (normal and shiny).",
    selectType: "Please select at least one type (max 2).",
    imgError: "Cannot load image",
  },
};

const LANG_MAP = { fr: "french", en: "english" };

const AddPokemon = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = TEXT[language];
  const langKey = LANG_MAP[language];

  const [imageError, setImageError] = useState(false);
  const [shinyError, setShinyError] = useState(false);
  const [pokemon, setPokemon] = useState({
    name: { english: "", japanese: "", chinese: "", french: "" },
    type: [],
    base: { HP: 1, Attack: 1, Defense: 1, SpecialAttack: 1, SpecialDefense: 1, Speed: 1 },
    image: "",
    shiny: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    let newTypes = [...pokemon.type];
    if (newTypes.includes(type)) newTypes = newTypes.filter((t) => t !== type);
    else if (newTypes.length < 2) newTypes.push(type);
    setPokemon({ ...pokemon, type: newTypes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pokemon.image || !pokemon.shiny || Object.values(pokemon.name).some((v) => v.trim() === "")) {
      alert(t.fillFields);
      return;
    }
    if (pokemon.type.length === 0) {
      alert(t.selectType);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/pokemons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pokemon),
      });
      if (response.ok) navigate("/");
      else alert("Erreur lors de l'ajout du Pokémon");
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  return (
    <div className="add-container">
      <div className="add-card">
        <h2>{t.title}</h2>

        <button className="back-button" onClick={() => navigate(-1)}>
          {t.back}
        </button>

        <form onSubmit={handleSubmit}>
          {/* NOMS */}
          {Object.keys(pokemon.name).map((lang) => (
            <div key={lang} className="input-group">
              <label>
                {language === "fr" ? `Nom (${lang})` : `Name (${lang})`}
              </label>
              <input
                type="text"
                name={lang}
                value={pokemon.name[lang]}
                onChange={handleChange}
                required
              />
            </div>
          ))}


          {/* TYPES */}
          <h3>{t.typeTitle}</h3>
          <div className="type-selector">
            {Object.keys(TYPE_IMAGES).map((type) => (
              <img
                key={type}
                src={TYPE_IMAGES[type]}
                alt={type}
                className={`type-image ${pokemon.type.includes(type) ? "selected" : ""}`}
                onClick={() => toggleType(type)}
              />
            ))}
          </div>

          {/* STATS */}
          <h3>{t.statsTitle}</h3>
          {Object.keys(pokemon.base).map((stat) => (
            <div key={stat} className="stat-group">
              <label>{stat}</label>
              <input
                type="range"
                min="1"
                max="255"
                name={stat}
                value={pokemon.base[stat]}
                onChange={handleChange}
              />
              <span>{pokemon.base[stat]}</span>
            </div>
          ))}

          {/* IMAGE NORMALE */}
          <h3>{t.imageNormal}</h3>
          <input
            type="text"
            name="image"
            placeholder={t.imageNormal}
            value={pokemon.image}
            onChange={handleChange}
            required
          />
          {pokemon.image && (
            <div className="image-preview">
              {!imageError ? (
                <img src={pokemon.image} alt="Preview Pokémon" onError={() => setImageError(true)} />
              ) : (
                <p className="image-error">{t.imgError}</p>
              )}
            </div>
          )}

          {/* IMAGE SHINY */}
          <h3>{t.imageShiny}</h3>
          <input
            type="text"
            name="shiny"
            placeholder={t.imageShiny}
            value={pokemon.shiny}
            onChange={handleChange}
            required
          />
          {pokemon.shiny && (
            <div className="image-preview">
              {!shinyError ? (
                <img src={pokemon.shiny} alt="Preview Shiny" onError={() => setShinyError(true)} />
              ) : (
                <p className="image-error">{t.imgError}</p>
              )}
            </div>
          )}

          <button type="submit" className="submit-button">{t.submit}</button>
        </form>
      </div>
    </div>
  );
};

export default AddPokemon;
