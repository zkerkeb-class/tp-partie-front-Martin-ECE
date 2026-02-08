import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TYPE_OPTIONS = [
  "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison",
  "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"
];

const AddPokemon = () => {
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState({
    name: { english: "", japanese: "", chinese: "", french: "" },
    type: [],
    base: { HP: 1, Attack: 1, Defense: 1, SpecialAttack: 1, SpecialDefense: 1, Speed: 1 },
    image: "",
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    // Stats
    if (["HP", "Attack", "Defense", "SpecialAttack", "SpecialDefense", "Speed"].includes(name)) {
      setPokemon({
        ...pokemon,
        base: { ...pokemon.base, [name]: Number(value) },
      });
    }
    // Types (checkbox)
    else if (TYPE_OPTIONS.includes(value)) {
      let newTypes = [...pokemon.type];
      if (checked) {
        if (newTypes.length < 2) newTypes.push(value);
      } else {
        newTypes = newTypes.filter((t) => t !== value);
      }
      setPokemon({ ...pokemon, type: newTypes });
    }
    // Langues du nom
    else if (["english", "japanese", "chinese", "french"].includes(name)) {
      setPokemon({
        ...pokemon,
        name: { ...pokemon.name, [name]: value },
      });
    }
    // Image
    else if (name === "image") {
      setPokemon({ ...pokemon, image: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/pokemons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pokemon),
      });

      if (response.ok) {
        navigate("/");
      } else {
        const errMsg = await response.text();
        alert("Erreur lors de l'ajout du Pokémon : " + errMsg);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du Pokémon (fetch)");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Ajouter un Pokémon</h2>

      {/* BOUTON RETOUR */}
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px", padding: "5px 15px" }}
      >
        Retour
      </button>

      <form onSubmit={handleSubmit}>
        {/* Nom dans toutes les langues */}
        {["french", "english", "japanese", "chinese"].map((lang) => (
          <div key={lang}>
            <label>Nom ({lang}) : </label>
            <input
              type="text"
              name={lang}
              value={pokemon.name[lang]}
              onChange={handleChange}
              required={lang === "french"}
            />
          </div>
        ))}

        {/* Types - max 2 */}
        <div>
          <label>Types (max 2) :</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
            {TYPE_OPTIONS.map((type) => (
              <label key={type} style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  value={type}
                  checked={pokemon.type.includes(type)}
                  onChange={handleChange}
                  disabled={!pokemon.type.includes(type) && pokemon.type.length >= 2}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Stats */}
        <h3>Stats</h3>
        {Object.keys(pokemon.base).map((stat) => (
          <div key={stat}>
            <label>{stat} : </label>
            <input
              type="range"
              min="1"
              max="255"
              name={stat}
              value={pokemon.base[stat]}
              onChange={handleChange}
            />
            <span> {pokemon.base[stat]}</span>
          </div>
        ))}

        {/* Image */}
        <div>
          <label>Image (URL) : </label>
          <input
            type="text"
            name="image"
            value={pokemon.image}
            onChange={handleChange}
            required
          />
        </div>

        {/* Bouton Ajouter */}
        <button type="submit" style={{ marginTop: "20px", padding: "10px 20px" }}>
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default AddPokemon;
