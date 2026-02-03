import type { Color as PlayerColor } from "chess.js";
import { useState } from "react";
import type { GameMode } from "../../types";
import MoveHandler from "./move-handler";

export default function GameModeSelector() {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [playerColor, setPlayerColor] = useState<PlayerColor | null>(null);
  const backToSetup = () => {
    setMode(null);
    setPlayerColor(null);
  };

  if (mode && playerColor) {
    return (
      <MoveHandler
        mode={mode}
        playerColor={playerColor}
        onExitToSetup={backToSetup}
      />
    );
  }
  return (
    <div className="select">
      <h2>Setup partita</h2>

      {!mode && (
        <div>
          <span>Modalità:</span>

          <button onClick={() => setMode("player-vs-computer")}>
            Vs computer
          </button>

          <button onClick={() => setMode("player-vs-player")}>
            2 giocatori
          </button>
        </div>
      )}

      {mode && !playerColor && (
        <div>
          <span>Colore:</span>

          <div className="row">
            <button onClick={() => setPlayerColor("w")}>Bianco</button>
            <button onClick={() => setPlayerColor("b")}>Nero</button>
          </div>

          <button className="back" onClick={backToSetup}>
            Indietro
          </button>
        </div>
      )}
    </div>
  );
}
