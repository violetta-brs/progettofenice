import React from "react";
import ChessBoard from "./components/scacchiera/chessboard.jsx";
import "./App.scss";

function App() {
  return (
    <div className="app-container">
      <h1>La mia App di Scacchi</h1>
      <ChessBoard />
    </div>
  );
}

export default App;