import { Routes, Route } from "react-router-dom";
import PokeList from "./components/pokelist";
import AddPokemon from "./components/add";
import PokeDetails from "./components/pokemondetails";
import DeletePokemon from "./components/delete";
import UpdatePokemon from "./components/update";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PokeList />} />
      <Route path="/add" element={<AddPokemon />} />
      <Route path="/pokemon/:id" element={<PokeDetails />} />
      <Route path="/delete" element={<DeletePokemon />} />
      <Route path="/update/:id" element={<UpdatePokemon />} />
    </Routes>
  );
}

export default App;
