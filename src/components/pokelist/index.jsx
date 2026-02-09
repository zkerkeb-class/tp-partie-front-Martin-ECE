import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PokeCard from "../pokecard";
import { useLanguage } from "../../LanguageContext";
import "./index.css";

const LIMIT = 20;

const TEXT = {
  fr: {
    pokedex: "POKÉDEX",
    search: "Rechercher un Pokémon...",
    add: "Ajouter un Pokémon",
    delete: "Supprimer un Pokémon",
    prev: "◀ Précédent",
    next: "Suivant ▶",
    none: "Aucun Pokémon trouvé",
    lang: "Langue"
  },
  en: {
    pokedex: "POKEDEX",
    search: "Search a Pokémon...",
    add: "Add Pokémon",
    delete: "Delete Pokémon",
    prev: "◀ Previous",
    next: "Next ▶",
    none: "No Pokémon found",
    lang: "Language"
  }
};

const LANG_MAP = { fr: "french", en: "english" };

const PokeList = () => {
  const { language, setLanguage } = useLanguage();
  const t = TEXT[language];

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

  const filteredPokemons = allPokemons.filter((pokemon) =>
    pokemon.name.french.toLowerCase().includes(search.toLowerCase()) ||
    pokemon.name.english.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPokemons.length / LIMIT);
  const paginatedPokemons = filteredPokemons.slice((page - 1) * LIMIT, page * LIMIT);

  const goToPage = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const langKey = LANG_MAP[language] || "french";

  return (
    <div>
      {/* HEADER ET SÉLECTEUR DE LANGUE */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="pokedex-title">{t.pokedex}</h2>

        <div>
          <label htmlFor="language-select" style={{ marginRight: "8px", fontWeight: "bold" }}>{t.lang}:</label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>

      {/* PAGINATION EN HAUT */}
      <div className="pagination">
        <button onClick={() => goToPage(page - 1)} disabled={page === 1}>{t.prev}</button>
        <span className="pagenombre">Page {page} / {totalPages}</span>
        <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}>{t.next}</button>
      </div>

      {/* RECHERCHE */}
      <input
        type="text"
        placeholder={t.search}
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="search-input"
      />

      {/* BOUTONS ACTION */}
      <div className="action-buttons">
        <Link to="/add"><button>{t.add}</button></Link>
        <Link to="/delete"><button>{t.delete}</button></Link>
      </div>

      {/* GRILLE POKÉMON */}
      <div className="poke-list">
        {paginatedPokemons.length > 0 ? (
          paginatedPokemons.map((pokemon) => (
            <PokeCard key={pokemon.id} pokemon={pokemon} langKey={langKey} />
          ))
        ) : <p>{t.none}</p>}
      </div>

      {/* PAGINATION EN BAS */}
      <div className="pagination">
        <button onClick={() => goToPage(page - 1)} disabled={page === 1}>{t.prev}</button>
        <span className="pagenombre">Page {page} / {totalPages}</span>
        <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}>{t.next}</button>
      </div>
    </div>
  );
};

export default PokeList;
