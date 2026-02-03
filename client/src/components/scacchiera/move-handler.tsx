import { Chess, QUEEN, type Move, type Square } from "chess.js";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ChessTurn, GameMode, PlayerColor, Strategy } from "../../types";
import { fromChessTurn, toChessTurn } from "../../types";
import {
  colorDisplayName,
  formatTime,
  getOpponent,
  randomChoice,
} from "../../utils";
import ChessBoard from "./chessboard";

type MoveHandlerProps = {
  mode: GameMode;
  playerColor: PlayerColor;
  onExitToSetup: () => void;
};

const INITIAL_SECONDS = 5 * 60;
const randomStrategy: Strategy = (moves) => randomChoice(moves);

export default function MoveHandler({
  mode,
  playerColor,
  onExitToSetup,
}: MoveHandlerProps) {
  const [fen, setFen] = useState(new Chess().fen());

  const [whiteSeconds, setWhiteSeconds] = useState(INITIAL_SECONDS);
  const [blackSeconds, setBlackSeconds] = useState(INITIAL_SECONDS);

  const [timeoutWinner, setTimeoutWinner] = useState<PlayerColor | null>(null);

  const activeDeadlineRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const renderTimeoutRef = useRef<number | null>(null);

  // forza re-render per aggiornare il display del timer
  const [, forceRender] = useState(0);

  const game = useMemo(() => new Chess(fen), [fen]);
  const activeTurn: ChessTurn = game.turn();
  const activeColor: PlayerColor = fromChessTurn(activeTurn);
  const board = game.board();

  const isBoardGameOver =
    typeof game.isGameOver === "function"
      ? game.isGameOver()
      : (game as any).game_over();
  const isGameOver = isBoardGameOver || timeoutWinner !== null;

  const clearTimeoutSafe = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const clearRenderTimeoutSafe = () => {
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
      renderTimeoutRef.current = null;
    }
  };

  const getStored = (c: PlayerColor) =>
    c === "WHITE" ? whiteSeconds : blackSeconds;

  // Calcola i secondi mostrati
  const getShown = (c: PlayerColor) => {
    const stored = getStored(c);
    if (isGameOver) return stored;

    if (c !== activeColor) return stored;

    const deadline = activeDeadlineRef.current;
    if (!deadline) return stored;

    const ms = deadline - Date.now();
    return Math.max(0, Math.floor(ms / 1000));
  };

  // salva il tempo rimanente nel turno attivo
  const commitActiveTime = () => {
    const deadline = activeDeadlineRef.current;
    if (!deadline) return;

    const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));

    if (activeColor === "WHITE") setWhiteSeconds(remaining);
    else setBlackSeconds(remaining);
  };

  // schedula il prossimo aggiornamento del timer
  const scheduleNextRender = () => {
    if (isGameOver) return;

    clearRenderTimeoutSafe();

    const deadline = activeDeadlineRef.current;
    if (!deadline) return;

    const now = Date.now();
    const remaining = deadline - now;

    if (remaining <= 0) {
      return;
    }

    // remaining % 1000 quanti ms mancano al prossimo cambio di secondo
    const msUntilNextSecond = remaining % 1000 || 1000;

    renderTimeoutRef.current = window.setTimeout(() => {
      forceRender((n) => n + 1);
      scheduleNextRender(); // Schedula il prossimo
    }, msUntilNextSecond);
  };

  // Inizializza il timer quando cambia il turno
  useLayoutEffect(() => {
    if (isGameOver) return;

    clearTimeoutSafe();

    const remaining = getStored(activeColor);
    activeDeadlineRef.current = Date.now() + remaining * 1000;

    timeoutRef.current = window.setTimeout(() => {
      setTimeoutWinner(getOpponent(activeColor));
    }, remaining * 1000);

    scheduleNextRender();

    return () => {
      clearTimeoutSafe();
      clearRenderTimeoutSafe();
    };
  }, [fen, activeColor, isGameOver]);

  useEffect(() => {
    return () => {
      clearTimeoutSafe();
      clearRenderTimeoutSafe();
    };
  }, []);

  const gameOverMessage = useMemo((): string => {
    if (game.isStalemate()) return "Patta per stallo";
    if (game.isDraw()) return "Patta";

    if (timeoutWinner) {
      return `Tempo scaduto vince il ${colorDisplayName(timeoutWinner)}`;
    }

    if (game.isCheckmate()) {
      const checkMateWinner = getOpponent(fromChessTurn(game.turn()));
      return `Scacco matto: vince il ${checkMateWinner}`;
    }

    throw new Error("Reached unreachable code");
  }, [timeoutWinner, fen]);

  const makeMove = (currentGame: Chess) => {
    const moves = currentGame.moves({ verbose: true }) as Move[];
    if (moves.length === 0) return;
    currentGame.move(randomStrategy(moves));
    setFen(currentGame.fen());
  };

  useEffect(() => {
    if (isGameOver) return;
    if (mode !== "player-vs-computer") return;

    const humanTurn = toChessTurn(playerColor);
    if (game.turn() === humanTurn) return;

    const id = window.setTimeout(() => {
      commitActiveTime();

      const g = new Chess(fen);
      makeMove(g);
    }, 600);

    return () => clearTimeout(id);
  }, [fen, mode, playerColor, timeoutWinner]);

  const handlePlayerMove = (from: Square, to: Square) => {
    if (isGameOver) return;

    const newGame = new Chess(fen);
    const humanTurn = toChessTurn(playerColor);

    // pvc, muovi solo se è il tuo turno
    if (mode === "player-vs-computer" && newGame.turn() !== humanTurn) return;

    // evita errori di mosse illegali
    const legal = (
      newGame.moves({ square: from, verbose: true }) as any[]
    ).some((m) => m.to === to);
    if (!legal) return;

    // salva il tempo passato nel turno
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

      <div className="timer-display">
        <div>Bianco: {formatTime(getShown("WHITE"))}</div>
        <div>Nero: {formatTime(getShown("BLACK"))}</div>
      </div>

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
