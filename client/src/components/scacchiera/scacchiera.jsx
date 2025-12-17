// Importo React e useEffect
import React, { useEffect } from "react";

// Importo dalla cartella lib/cm-chessboard
// non me lo faceva fare iport da node_modules
import "../../lib/cm-chessboard/chessboard.css";
import { Chessboard } from "../../lib/cm-chessboard/Chessboard.js";

// Importo il mio SCSS
import "./scacchiera.scss";

function Scacchiera() {
  useEffect(() => {
    // Inizializza la scachiera nel div con id 'board'
    const boardElement = document.getElementById("board");
    // Crea la scacchiera
    const board = new Chessboard(boardElement, {
      position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    });

    // Pulisce la scacchiera quando il componente viene smontato
    return () => board.destroy();
  }, []); // L'array vuoto assicura che il comando venga eseguito solo una volta al montaggio

  // Uso di classi BEM per lo styling
  return (
    <div className="scacchiera-container">
      <h2 className="scacchiera-container__titolo">Scacchiera base</h2>
      <div
        id="board"
        className="scacchiera-container__board"
        style={{ width: "400px", height: "400px" }}
      />
    </div>
  );
}
// Esporto il compontente Scacchiera
export default Scacchiera;
