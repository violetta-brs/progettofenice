import "./App.scss";
import GameModeSelector from "./components/scacchiera/select-game.tsx";

function App() {
  return (
    <div className="app-container">
      <h1>La mia App di Scacchi</h1>
    <GameModeSelector />
    </div>
  );
}

export default App;
