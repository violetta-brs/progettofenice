import React from "react";
import CasualMove from "./components/scacchiera/casualmove";
import "./App.scss";

function App() {
  return (
    <div className="app-container">
      <h1>La mia App di Scacchi</h1>
      <CasualMove />
    </div>
  );
}

export default App;