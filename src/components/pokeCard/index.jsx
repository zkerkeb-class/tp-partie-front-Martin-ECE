import "./index.css";
import { Link } from "react-router-dom";

const PokeCard = ({ pokemon }) => {
  if (!pokemon) return null;

  // Données venant de MongoDB
  const type = pokemon.type?.[0]?.toLowerCase() || "normal";
  const image = pokemon.image;
  const hp = pokemon.base.HP;
  const attack = pokemon.base.Attack;
  const defense = pokemon.base.Defense;
  const speed = pokemon.base.Speed;

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      style={{ textDecoration: "none" }}
    >
      <div className="poke-card-container">
        <div className="poke-card-wrapper">
          <div className="poke-card-inner">

            {/* FRONT */}
            <div className={`poke-card tcg-card ${type}`}>
              {/* HEADER */}
              <div className="tcg-header">
                <span className="tcg-name">{pokemon.name.french}</span>
                <span className="tcg-hp">PV {hp}</span>
              </div>

              {/* IMAGE */}
              <div className="tcg-image-frame">
                <img src={image} alt={pokemon.name.french} />
              </div>

              {/* STATS */}
              <div className="tcg-attacks">
                <div className="tcg-attack">
                  <span>Attaque</span>
                  <strong>{attack}</strong>
                </div>
                <div className="tcg-attack">
                  <span>Défense</span>
                  <strong>{defense}</strong>
                </div>
                <div className="tcg-attack">
                  <span>Vitesse</span>
                  <strong>{speed}</strong>
                </div>
              </div>

              {/* FOOTER */}
              <div className="tcg-footer">
                <span>ID #{pokemon.id}</span>
                <span>Type {pokemon.type.join(", ")}</span>
              </div>
            </div>

            {/* BACK */}
            <div className="poke-card poke-card-back">
              <img
                src="/back.jpg"
                alt="Pokemon card back"
                className="back-image"
              />
            </div>

          </div>
        </div>
      </div>
    </Link>
  );
};

export default PokeCard;
