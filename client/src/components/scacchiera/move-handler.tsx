import {
  Chess,
  QUEEN,
  type Square,
  BLACK,
  WHITE,
  type Color,
} from "chess.js";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { GameMode, Strategy } from "../../types";
import { randomChoice, makeGameOverMessage } from "../../utils";
import ChessBoard from "./chessboard";
import TimerDisplay from "./timer-display";
import { usePcMove } from "./use-pc-move";

type MoveHandlerProps = {
  mode: GameMode;
  playerColor: Color;
  onExitToSetup: () => void;
};

const INITIAL_MS = 8 * 60 * 1000;
const randomStrategy: Strategy = (moves) => randomChoice(moves);

export default function MoveHandler({
  mode,
  playerColor,
  onExitToSetup,
}: MoveHandlerProps) {
  const [fen, setFen] = useState(new Chess().fen());
  const [whiteMs, setWhiteMs] = useState(INITIAL_MS);
  const [blackMs, setBlackMs] = useState(INITIAL_MS);
  const [turnStartedAt, setTurnStartedAt] = useState<number | null>(null);

  const turnColorRef = useRef<Color | null>(null);
  const endTurnTimeoutIdRef = useRef<number | null>(null);

  const game = useMemo(() => new Chess(fen), [fen]);
  const activeColor: Color = game.turn();
  const board = game.board();

  const timeoutWinner: Color | null =
    whiteMs <= 0 ? BLACK : blackMs <= 0 ? WHITE : null;

  const isGameOver: boolean = game.isGameOver() || timeoutWinner !== null;
  const gameOverMessage = makeGameOverMessage(game, timeoutWinner);

  // applico tempo trascorso ad ogni mossa/cambio tuno con un minimo 1sec
  function applyElapsedTimeMs(minMs: number = 0) {
    if (turnStartedAt === null) return;
    const turnColor = turnColorRef.current;
    if (turnColor === null) return;

    const now = Date.now();
    const elapsedMs = now - turnStartedAt;
    const effectiveMs = Math.max(elapsedMs, minMs);

    if (turnColor === WHITE) {
      setWhiteMs((prev) => Math.max(0, prev - effectiveMs));
    } else {
      setBlackMs((prev) => Math.max(0, prev - effectiveMs));
    }

    setTurnStartedAt(now);
  }

  usePcMove(
    fen,
    mode,
    playerColor,
    activeColor,
    isGameOver,
    randomStrategy,
    setFen,
    applyElapsedTimeMs,
  );

  // cancello timeout precedente
  function clearEndTurnTimeout() {
    if (endTurnTimeoutIdRef.current !== null) {
      clearTimeout(endTurnTimeoutIdRef.current);
      endTurnTimeoutIdRef.current = null;
    }
  }

  // gestisco timer a ogni cambio fen o cambio turno
  useLayoutEffect(() => {
    const start = Date.now();
    clearEndTurnTimeout();
    if (isGameOver) return;

    setTurnStartedAt(start);
    turnColorRef.current = activeColor;

    const isWhiteTurn = activeColor === WHITE;
    const remainingMs = isWhiteTurn ? whiteMs : blackMs;
    if (remainingMs <= 0) return;

    endTurnTimeoutIdRef.current = window.setTimeout(() => {
      (isWhiteTurn ? setWhiteMs : setBlackMs)(0);
    }, remainingMs);

    return clearEndTurnTimeout;
  }, [fen, isGameOver]);

  const handlePlayerMove = (from: Square, to: Square) => {
    const game = new Chess(fen);

    if (isGameOver) return;
    if (mode === "player-vs-computer" && game.turn() !== playerColor) return;

    const moved = game.move({ from, to, promotion: QUEEN });
    if (!moved) return;

    applyElapsedTimeMs();
    setFen(game.fen());
  };

  return (
    <div className="move-handler-container">
      <button className="back" onClick={onExitToSetup}>
        Torna al setup
      </button>

      <TimerDisplay
        whiteBase={whiteMs}
        blackBase={blackMs}
        activeColor={activeColor}
        turnStartedAt={turnStartedAt}
        isGameOver={isGameOver}
      />

      {gameOverMessage && (
        <div className="game-over">
          <p>{gameOverMessage}</p>
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
