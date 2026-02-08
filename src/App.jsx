import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PokeList from './components/pokelist'
import PokeDetails from './components/pokemondetails'
import AddPokemon from "./components/add";

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PokeList />} />
          <Route path="/pokemon/:id" element={<PokeDetails />} />
          <Route path="/add" element={<AddPokemon />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
