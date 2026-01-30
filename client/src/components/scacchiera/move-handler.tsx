import { Chess, QUEEN, type Move, type Square } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import type { Strategy, PlayerColor } from "../../types.ts";
import { randomChoice } from "../../utils.ts";
import ChessBoard from "./chessboard.tsx";

type GameMode = "player-vs-computer" | "player-vs-player";

type MoveHandlerProps = {
  mode: GameMode;
  playerColor: PlayerColor;
  onExitToSetup: () => void;
};

const randomStrategy: Strategy = (moves) => randomChoice(moves);

const INITIAL_SECONDS = 5 * 60;

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function MoveHandler({
  mode,
  playerColor,
  onExitToSetup,
}: MoveHandlerProps) {
  const [fen, setFen] = useState(new Chess().fen());

  const [whiteSeconds, setWhiteSeconds] = useState(INITIAL_SECONDS);
  const [blackSeconds, setBlackSeconds] = useState(INITIAL_SECONDS);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);

  const game = useMemo(() => new Chess(fen), [fen]);
  const activeColor = game.turn();
  const board = game.board();

  const makeMove = (
    currentGame: Chess,
    moveChoiceStrategy: (choices: Move[]) => Move = randomStrategy
  ): void => {
    const possibleMoves = currentGame.moves({ verbose: true });
    if (possibleMoves.length === 0) return;
    currentGame.move(moveChoiceStrategy(possibleMoves));
    setFen(currentGame.fen());
  };

  // Se giochi Nero vs PC, il PC (bianco) deve iniziare
  useEffect(() => {
    if (mode !== "player-vs-computer") return;

    const startGame = new Chess(fen);
    const turn = startGame.turn();

    if (turn !== playerColor) {
      setTimeout(() => makeMove(startGame), 300);
    }
  }, []);

  useEffect(() => {
    if (isGameOver) return;

    const id = setInterval(() => {
      if (activeColor === "w") {
        setWhiteSeconds((prev) => {
          if (prev <= 1) {
            setIsGameOver(true);
            setGameOverMessage("Tempo scaduto: vince il Nero");
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackSeconds((prev) => {
          if (prev <= 1) {
            setIsGameOver(true);
            setGameOverMessage("Tempo scaduto: vince il Bianco");
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(id);
  }, [activeColor, isGameOver]);

  const handlePlayerMove = (source: Square, target: Square) => {
    if (isGameOver) return;

    const newGame = new Chess(fen);

    // in pvc, puoi muovere solo quando è il tuo turno
    if (mode === "player-vs-computer" && newGame.turn() !== playerColor) return;

    const move = newGame.move({
      from: source,
      to: target,
      promotion: QUEEN,
    });
    if (!move) return;

    setFen(newGame.fen());

    // pc risponde solo in pvc
    if (mode === "player-vs-computer") {
      setTimeout(() => makeMove(newGame), 500);
    }
  };

  return (
    <div className="move-handler-container">
      <button className="select-btn select-btn-back" onClick={onExitToSetup}>
        Torna al setup
      </button>

      <div className="timer-display">
        <div>Bianco: {formatTime(whiteSeconds)}</div>
        <div>Nero: {formatTime(blackSeconds)}</div>
      </div>

      {isGameOver && (
        <div className="game-over">
          <p>{gameOverMessage ?? "Game Over"}</p>
        </div>
      )}

      <ChessBoard
        board={board}
        onMove={handlePlayerMove}
        activeColor={activeColor}
        mode={mode}
        playerColor={playerColor}
      />
    </div>
  );
}
