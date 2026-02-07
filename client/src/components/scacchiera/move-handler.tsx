import { Chess, QUEEN, type Move, type Square } from "chess.js";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ChessTurn, GameMode, PlayerColor, Strategy } from "../../types";
import { fromChessTurn, toChessTurn } from "../../types";
import { randomChoice } from "../../utils";
import ChessBoard from "./chessboard";
import TimerDisplay from "./timer-display";

type MoveHandlerProps = {
  mode: GameMode;
  playerColor: PlayerColor;
  onExitToSetup: () => void;
};

const INITIAL_SECONDS = 8 * 60;
const randomStrategy: Strategy = (moves) => randomChoice(moves);

export default function MoveHandler({
  mode,
  playerColor,
  onExitToSetup,
}: MoveHandlerProps) {
  const [fen, setFen] = useState(new Chess().fen());
  const [whiteSeconds, setWhiteSeconds] = useState(INITIAL_SECONDS);
  const [blackSeconds, setBlackSeconds] = useState(INITIAL_SECONDS);

  const timeoutRef = useRef<number | null>(null);
  const turnColorRef = useRef<PlayerColor | null>(null);

  const game = useMemo(() => new Chess(fen), [fen]);
  const activeTurn: ChessTurn = game.turn();
  const activeColor: PlayerColor = fromChessTurn(activeTurn);
  const board = game.board();

  const isBoardGameOver =
    typeof game.isGameOver === "function"
      ? game.isGameOver()
      : (game as any).game_over();

  const timeoutWinner: PlayerColor | null =
    whiteSeconds <= 0 ? "BLACK" : blackSeconds <= 0 ? "WHITE" : null;

  const isGameOver = isBoardGameOver || timeoutWinner !== null;

  const clearTimeoutSafe = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const getStored = (c: PlayerColor) =>
    c === "WHITE" ? whiteSeconds : blackSeconds;

  const MIN_PC_SECONDS = 3;

  // istante T di inizio turno
  const [turnStartedAt, setTurnStartedAt] = useState<number | null>(null); 

  const commitActiveTimeWithMin = (minSeconds: number) => {
    if (!turnStartedAt) return;
    const turnColor = turnColorRef.current;
    if (!turnColor) return;

    //istante T inizio turno + tempo reale trascorso = tempo speso effettivo
    const now = Date.now();
    const timeSpended = (now - turnStartedAt) / 1000;
    const effectiveTimeSpended = Math.max(timeSpended, minSeconds);

    //tempo speso effettivo - tempo trascorso da inizio turno = tempo rimanente
    if (turnColor === "WHITE") {
      setWhiteSeconds((prev) =>
        Math.max(0, Math.floor(prev - effectiveTimeSpended)),
      );
    } else {
      setBlackSeconds((prev) =>
        Math.max(0, Math.floor(prev - effectiveTimeSpended)),
      );
    }

    setTurnStartedAt(now);
  };

  const commitActiveTime = () => commitActiveTimeWithMin(0);

  useLayoutEffect(() => {
    clearTimeoutSafe();
    if (isGameOver) return;

    const start = Date.now();
    setTurnStartedAt(start);
    turnColorRef.current = activeColor;

    const remaining = getStored(activeColor);
    if (remaining <= 0) return;

    timeoutRef.current = window.setTimeout(() => {
      const turnColor = turnColorRef.current;
      if (!turnColor) return;

      if (turnColor === "WHITE") setWhiteSeconds(0);
      else setBlackSeconds(0);
    }, remaining * 1000);

    return clearTimeoutSafe;
  }, [fen, activeColor, isGameOver]);

  let gameOverMessage: string | null = null;
  if (timeoutWinner) {
    gameOverMessage =
      timeoutWinner === "WHITE"
        ? "Tempo scaduto: vince il Bianco"
        : "Tempo scaduto: vince il Nero";
  } else if (isBoardGameOver) {
    const isCheckmate =
      typeof (game as any).isCheckmate === "function" &&
      (game as any).isCheckmate();
    const isStalemate =
      typeof (game as any).isStalemate === "function" &&
      (game as any).isStalemate();
    const isDraw =
      typeof (game as any).isDraw === "function" && (game as any).isDraw();

    if (isCheckmate) {
      gameOverMessage =
        fromChessTurn(game.turn()) === "WHITE"
          ? "Scacco matto: vince il Nero"
          : "Scacco matto: vince il Bianco";
    } else if (isStalemate) {
      gameOverMessage = "Patta per stallo";
    } else if (isDraw) {
      gameOverMessage = "Patta";
    } else {
      gameOverMessage = "Game Over";
    }
  }

  const makeMove = (currentGame: Chess) => {
    const moves = currentGame.moves({ verbose: true }) as Move[];
    if (moves.length === 0) return;
    currentGame.move(randomStrategy(moves));
    setFen(currentGame.fen());
  };

  const pcMoveTimeoutRef = useRef<number | null>(null);

  const clearPcMoveTimeoutSafe = () => {
    if (pcMoveTimeoutRef.current !== null) {
      clearTimeout(pcMoveTimeoutRef.current);
      pcMoveTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    clearPcMoveTimeoutSafe();

    if (isGameOver) return;
    if (mode !== "player-vs-computer") return;

    const humanTurn = toChessTurn(playerColor);
    if (game.turn() === humanTurn) return; 

    pcMoveTimeoutRef.current = window.setTimeout(() => {
      commitActiveTimeWithMin(MIN_PC_SECONDS);
      makeMove(new Chess(fen));
    }, 2000);

    return clearPcMoveTimeoutSafe;
  }, [fen, mode, playerColor, isGameOver, game]);

  const handlePlayerMove = (from: Square, to: Square) => {
    if (isGameOver) return;

    const newGame = new Chess(fen);
    const humanTurn = toChessTurn(playerColor);

    if (mode === "player-vs-computer" && newGame.turn() !== humanTurn) return;

    const legal = (
      newGame.moves({ square: from, verbose: true }) as any[]
    ).some((m) => m.to === to);
    if (!legal) return;

    // chiudo il turno prima della mossa
    commitActiveTime();

    const moved = newGame.move({ from, to, promotion: QUEEN });
    if (!moved) return;

    setFen(newGame.fen());
  };

  return (
    <div className="move-handler-container">
      <button className="back" onClick={onExitToSetup}>
        Torna al setup
      </button>

      <TimerDisplay
        whiteBase={whiteSeconds}
        blackBase={blackSeconds}
        activeColor={activeColor}
        turnStartedAt={turnStartedAt}
        isGameOver={isGameOver}
      />

      {isGameOver && (
        <div className="game-over">
          <p>{gameOverMessage ?? "Game Over"}</p>
        </div>
      )}

      <ChessBoard
        board={board}
        onMove={handlePlayerMove}
        activeColor={activeTurn}
        mode={mode}
        playerColor={playerColor}
      />
    </div>
  );
}
