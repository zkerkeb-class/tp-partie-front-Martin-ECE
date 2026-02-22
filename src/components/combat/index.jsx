import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../LanguageContext";
import "./index.css";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Combat = () => {
  const { language } = useLanguage();

  const TEXT = {
    fr: {
      title: "⚔️ Combat Pokémon",
      search1: "Rechercher Pokémon 1...",
      search2: "Rechercher Pokémon 2...",
      choose1: "Choisir Pokémon 1",
      choose2: "Choisir Pokémon 2",
      start: "Commencer",
      attack: "Attaquer",
      back: "⬅ Retour",
      fightStart: "🔥 Le combat commence !",
      wins: "a gagné le combat !",
      attacking: "{attacker} attaque !",
      damage: "{attacker} inflige {damage} dégâts !"
    },
    en: {
      title: "⚔️ Pokémon Battle",
      search1: "Search Pokemon 1...",
      search2: "Search Pokemon 2...",
      choose1: "Choose Pokemon 1",
      choose2: "Choose Pokemon 2",
      start: "Start",
      attack: "Attack",
      back: "⬅ Back",
      fightStart: "🔥 The battle begins!",
      wins: "wins the battle!",
      attacking: "{attacker} attacks!",
      damage: "{attacker} deals {damage} damage!"
    },
  };
  const t = TEXT[language];

  const [pokemons, setPokemons] = useState([]);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [hp1, setHp1] = useState(0);
  const [hp2, setHp2] = useState(0);
  const [message, setMessage] = useState("");
  const [turn, setTurn] = useState(1);
  const [isAttacking, setIsAttacking] = useState(false);
  const [winner, setWinner] = useState(null);
  const [started, setStarted] = useState(false);

  const langKey = language === "en" ? "english" : "french";

  useEffect(() => {
    fetch("http://localhost:3000/pokemons/all")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) =>
          a.name[langKey].localeCompare(b.name[langKey])
        );
        setPokemons(sorted);
      });
  }, [langKey]);

  const filtered1 = useMemo(() =>
    pokemons.filter((p) =>
      p.name[langKey].toLowerCase().includes(search1.toLowerCase())
    ), [search1, pokemons, langKey]);

  const filtered2 = useMemo(() =>
    pokemons.filter((p) =>
      p.name[langKey].toLowerCase().includes(search2.toLowerCase())
    ), [search2, pokemons, langKey]);

  const startFight = () => {
    if (!player1 || !player2) return;
    setWinner(null);
    setHp1(player1.base.HP);
    setHp2(player2.base.HP);
    setTurn(player1.base.Speed >= player2.base.Speed ? 1 : 2);
    setMessage(t.fightStart);
    setStarted(true);
  };

  const attack = async () => {
    if (isAttacking || winner) return;

    setIsAttacking(true);

    const attacker = turn === 1 ? player1 : player2;
    const defender = turn === 1 ? player2 : player1;
    const setDefHp = turn === 1 ? setHp2 : setHp1;
    const defHp = turn === 1 ? hp2 : hp1;

    setMessage(t.attacking.replace("{attacker}", attacker.name[langKey]));
    await sleep(700);

    const damage = Math.max(
      5,
      attacker.base.Attack - defender.base.Defense / 2
    );

    const newHp = Math.max(0, defHp - damage);
    setDefHp(newHp);

    setMessage(t.damage
      .replace("{attacker}", attacker.name[langKey])
      .replace("{damage}", Math.floor(damage))
    );
    await sleep(900);

    if (newHp <= 0) {
      setWinner(attacker);
      setMessage(`🏆 ${attacker.name[langKey]} ${t.wins}`);
      setIsAttacking(false);
      return;
    }

    setTurn(turn === 1 ? 2 : 1);
    setIsAttacking(false);
  };

  const hpPercent = (current, max) => (current / max) * 100;

  return (
    <div className="combat-container">
      <h2>{t.title}</h2>

      {!winner && (
        <>
          <div className="selectors styled-selectors">
            <div>
              <input
                placeholder={t.search1}
                value={search1}
                onChange={(e) => setSearch1(e.target.value)}
              />
              <select
                onChange={(e) =>
                  setPlayer1(pokemons.find(p => p.id == e.target.value))
                }
                className="pokemon-select"
              >
                <option>{t.choose1}</option>
                {filtered1.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name[langKey]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                placeholder={t.search2}
                value={search2}
                onChange={(e) => setSearch2(e.target.value)}
              />
              <select
                onChange={(e) =>
                  setPlayer2(pokemons.find(p => p.id == e.target.value))
                }
                className="pokemon-select"
              >
                <option>{t.choose2}</option>
                {filtered2.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name[langKey]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="start-btn" onClick={startFight}>
            {t.start}
          </button>
        </>
      )}

      {player1 && player2 && !winner && hp1 > 0 && hp2 > 0 && (
        <div className="arena">
          {[{ p: player1, hp: hp1 }, { p: player2, hp: hp2 }].map(
            (obj, index) => (
              <div
                key={index}
                className={`pokemon-card ${turn === index + 1 ? "active" : ""}`}
              >
                <h3>{obj.p.name[langKey]}</h3>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${obj.p.id}.png`}
                  alt={obj.p.name[langKey]}
                  className={isAttacking && turn === index + 1 ? "attack" : ""}
                />
                <div className="hp-bar">
                  <div
                    className="hp-fill"
                    style={{
                      width: `${hpPercent(obj.hp, obj.p.base.HP)}%`
                    }}
                  />
                </div>
                <p>HP: {obj.hp} / {obj.p.base.HP}</p>
              </div>
            )
          )}
        </div>
      )}

      {started && !winner && (
        <button className="attack-btn" onClick={attack}>
          {t.attack}
        </button>
      )}

      {winner && (
        <div className="victory-screen">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${winner.id}.png`}
            alt={winner.name[langKey]}
            className="victory-sprite"
          />
          <h1>{winner.name[langKey]} {t.wins}</h1>
          <div className="confetti"></div>
          <button onClick={() => window.location.reload()} className="start-btn">
            {t.start}
          </button>
        </div>
      )}

      <p className="combat-message">{message}</p>

      <Link to="/">
        <button className="back-btn">{t.back}</button>
      </Link>
    </div>
  );
};

export default Combat;