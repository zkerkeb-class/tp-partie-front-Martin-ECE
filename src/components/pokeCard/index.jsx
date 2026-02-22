import "./index.css";
import { Link } from "react-router-dom";
import { useLanguage } from "../../LanguageContext";

const TEXT = {
  fr: { hp: "PV", attack: "Attaque", defense: "Défense", speed: "Vitesse" },
  en: { hp: "HP", attack: "Attack", defense: "Defense", speed: "Speed" },
};

const LANG_MAP = { fr: "french", en: "english" };

const PokeCard = ({ pokemon, langKey }) => {
  const { language } = useLanguage();
  const t = TEXT[language];
  const key = langKey || LANG_MAP[language] || "french";

  if (!pokemon) return null;

  const type = pokemon.type?.[0]?.toLowerCase() || "normal";

  return (
    <Link to={`/pokemon/${pokemon.id}`} style={{ textDecoration: "none" }}>
      <div className="poke-card-container">
        <div className="poke-card-wrapper">
          <div className="poke-card-inner">
            <div className={`poke-card tcg-card ${type}`}>
              <div className="tcg-header">
                <span className="tcg-name">{pokemon.name[key]}</span>
                <span className="tcg-hp">
                  {t.hp} {pokemon.base.HP}
                </span>
              </div>

              {/* IMAGE FRAME AVEC BACKGROUND TYPE */}
              <div
                className="tcg-image-frame"
                style={{
                  backgroundImage: `url(/${type}.png)`
                }}
              >
                <img src={pokemon.image} alt={pokemon.name[key]} />
              </div>

              <div className="tcg-attacks">
                <div className="tcg-attack">
                  <span>{t.attack}</span>
                  <strong>{pokemon.base.Attack}</strong>
                </div>
                <div className="tcg-attack">
                  <span>{t.defense}</span>
                  <strong>{pokemon.base.Defense}</strong>
                </div>
                <div className="tcg-attack">
                  <span>{t.speed}</span>
                  <strong>{pokemon.base.Speed}</strong>
                </div>
              </div>

              <div className="tcg-footer">
                <span>ID #{pokemon.id}</span>
                <span>Type {pokemon.type.join(", ")}</span>
              </div>
            </div>

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