import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PokeCard from "../pokeCard";
import "./index.css";

const PokeList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/pokemons")
      .then((res) => res.json())
      .then((data) => {
        setPokemons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur fetch :", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Liste des Pokémon</h2>

      {/* BOUTON AJOUTER */}
      <Link to="/add">
        <button style={{ marginBottom: "20px", padding: "10px 20px" }}>
          Ajouter un Pokémon
        </button>
      </Link>

      {/* LISTE DES CARTES */}
      <div className="poke-list">
        {pokemons.map((pokemon) => (
          <PokeCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default PokeList;
