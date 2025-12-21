import React, { useEffect } from "react";
import { Chessboard, FEN } from "cm-chessboard";
import 'cm-chessboard/assets/chessboard.css'; 
import "./scacchiera.scss";

function Scacchiera() {
  useEffect(() => {
    // Inizializza la scachiera nel div con id 'board'
    const boardElement = document.getElementById("board");
    // Crea la scacchiera
    const board = new Chessboard(boardElement, {
      position: FEN.start,
    });

    // Pulisce la scacchiera quando il componente viene smontato
    return () => board.destroy();
  }, []); // L'array vuoto assicura che il comando venga eseguito solo una volta al montaggio


  return (
    <div className="scacchiera-container">
      <h2>Scacchiera base</h2>
      <div
        id="board"
        className="scacchiera-board"/>
    </div>
  );
}
// Esporto il compontente Scacchiera
export default Scacchiera;
