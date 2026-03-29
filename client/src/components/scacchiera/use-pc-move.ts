import { useEffect, useRef } from "react";
import { Chess, Move, type Color } from "chess.js";
import type { GameMode, Strategy } from "../../types";

const PC_MOVE_DELAY_MS = 3000;

export function usePcMove(
  fen: string,
  mode: GameMode,
  playerColor: Color,
  activeColor: Color,
  isGameOver: boolean,
  strategy: Strategy,
  onMove: (newFen: string) => void,
  applyElapsedTimeMs: (minMs: number) => void,
) {

const pcDelayTimeoutRef = useRef<number | null>(null);

  function clearPcDelay() {
    if (pcDelayTimeoutRef.current !== null) {
      window.clearTimeout(pcDelayTimeoutRef.current);
      pcDelayTimeoutRef.current = null;
    }
  }

  function doPcMoveEffect() {
    clearPcDelay();

    if (isGameOver) return;
    if (mode !== "player-vs-computer") return;
    if (activeColor === playerColor) return;

    pcDelayTimeoutRef.current = window.setTimeout(() => {
      applyElapsedTimeMs(PC_MOVE_DELAY_MS);

      const game = new Chess(fen);
      const moves = game.moves({ verbose: true });

      if (moves.length === 0) {
        if (!game.isGameOver()) {
          throw new Error("Incoerenza stato gioco: nessuna mossa disponibile, ma non è gameOver");
        }
        return;
      }

      game.move(strategy(moves));
      onMove(game.fen());
    }, PC_MOVE_DELAY_MS);

    return clearPcDelay;
  }
  useEffect(doPcMoveEffect, [fen, isGameOver]);
}
