import "./App.scss";
import MoveHandler from "./components/scacchiera/move-handler.tsx";

function App() {
  return (
    <div className="app-container">
      <h1>La mia App di Scacchi</h1>
      <MoveHandler />
    </div>
  );
}

export default App;
