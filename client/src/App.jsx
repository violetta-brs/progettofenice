import React from "react";
import RandomMove from "./components/scacchiera/random-move";
import "./App.scss";

function App() {
  return (
    <div className="app-container">
      <h1>La mia App di Scacchi</h1>
      <RandomMove />
    </div>
  );
}

export default App;