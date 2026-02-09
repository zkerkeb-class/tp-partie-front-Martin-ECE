import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PokeCard from "../pokecard";
import "./index.css";

const LIMIT = 20;

const PokeList = () => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/pokemons/all");
        const data = await res.json();
        setAllPokemons(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <p>Chargement...</p>;

  // Filtrer globalement
  const filteredPokemons = allPokemons.filter((pokemon) =>
    pokemon.name.french.toLowerCase().includes(search.toLowerCase()) ||
    pokemon.name.english.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredPokemons.length / LIMIT);
  const paginatedPokemons = filteredPokemons.slice((page - 1) * LIMIT, page * LIMIT);

  const goToPage = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Remonter en haut de la page
  };

  return (
    <div>
      <h2 className="pokedex-title">POKEDEX</h2>

      {/* Pagination en haut */}
      <div className="pagination">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
        >
          ◀ Précédent
        </button>

        <span className="pagenombre">
          Page {page} / {totalPages}
        </span>

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
        >
          Suivant ▶
        </button>
      </div>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher un Pokémon..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="search-input"
      />

      {/* Boutons actions */}
      <div className="action-buttons">
        <Link to="/add">
          <button>Ajouter un Pokémon</button>
        </Link>

        <Link to="/delete">
          <button>Supprimer un Pokémon</button>
        </Link>
      </div>

      {/* Grille Pokémon */}
      <div className="poke-list">
        {paginatedPokemons.length > 0 ? (
          paginatedPokemons.map((pokemon) => (
            <PokeCard key={pokemon.id} pokemon={pokemon} />
          ))
        ) : (
          <p>Aucun Pokémon trouvé</p>
        )}
      </div>

      {/* Pagination en bas */}
      <div className="pagination">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
        >
          ◀ Précédent
        </button>

        <span className="pagenombre">
          Page {page} / {totalPages}
        </span>

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
        >
          Suivant ▶
        </button>
      </div>
    </div>
  );
};

export default PokeList;
