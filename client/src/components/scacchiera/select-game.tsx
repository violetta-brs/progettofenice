import { useState } from "react";
import MoveHandler from "./move-handler";

type GameMode = "player-vs-computer" | "player-vs-player";
type PlayerColor = "w" | "b";

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
    <div className="select-layout">
      <div className="select-sidebar">
        <div className="select-title">Setup partita</div>

        {!mode && (
          <div className="select-section">
            <div className="select-label">Modalità:</div>

            <button
              className="select-btn"
              onClick={() => setMode("player-vs-computer")}
            >
              Vs computer
            </button>

            <button
              className="select-btn"
              onClick={() => setMode("player-vs-player")}
            >
              2 giocatori
            </button>
          </div>
        )}
        {mode && !playerColor && (
          <div className="select-section">
            <div className="select-label">Colore:</div>

            <div className="select-row">
              <button
                className="select-btn"
                onClick={() => setPlayerColor("w")}
              >
                Bianco
              </button>
              <button
                className="select-btn"
                onClick={() => setPlayerColor("b")}
              >
                Nero
              </button>
            </div>

            <button
              className="select-btn select-btn-back"
              onClick={() => {
                setMode(null);
                setPlayerColor(null);
              }}
            >
              Indietro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
