import { useState, useEffect, useRef } from 'react';
import type { Square } from 'chess.js';
import { ChessInteractionHandler, type InteractionState } from '../../interactionHandler';
import ChessBoard from './ChessBoard';

interface ChessGameProps {
  autoComputerMove?: boolean;
  computerMoveDelay?: number;
  initialFen?: string;
}

export default function ChessGame({ 
  autoComputerMove = true, 
  computerMoveDelay = 500,
  initialFen 
}: ChessGameProps) {
  const [state, setState] = useState<InteractionState | null>(null);
  const handlerRef = useRef<ChessInteractionHandler | null>(null);
  const draggedFromRef = useRef<Square | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    handlerRef.current = new ChessInteractionHandler(initialFen, (newState) => {
      setState(newState);
    });
  }, [initialFen]);

  useEffect(() => {
    if (!state || !autoComputerMove || !handlerRef.current) return;

    const currentTurn = state.game.turn();
    if (currentTurn === 'b') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(async () => {
        if (handlerRef.current && handlerRef.current.getGame().turn() === 'b') {
          await handlerRef.current.makeComputerMove();
        }
      }, computerMoveDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state, autoComputerMove, computerMoveDelay]);

  if (!state) {
    return <div>Caricamento...</div>;
  }

  const handleDragStart = (e: React.DragEvent, squareName: Square) => {
    const square = state.game.get(squareName);
    if (!square || square.color !== 'w') {
      e.preventDefault();
      return;
    }
    draggedFromRef.current = squareName;
  };

  const handleDrop = async (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    if (!draggedFromRef.current || !handlerRef.current) return;
    const from = draggedFromRef.current;
    draggedFromRef.current = null;
    await handlerRef.current.handleDragDrop(from, targetSquare);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleReset = () => {
    if (handlerRef.current) {
      handlerRef.current.resetGame();
    }
  };

  return (
    <div className="chess-game-container">
      <div className="chess-game-header">
        <h2>Scacchi</h2>
        <div className="controls">
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
      <ChessBoard
        board={state.game.board()}
        selectedSquare={state.selectedSquare}
        possibleMoves={state.possibleMoves}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      />
      <div className="chess-game-info">
        <p>Turno: {state.game.turn() === 'w' ? 'Bianco' : 'Nero'}</p>
        <p>FEN: {state.fen}</p>
      </div>
    </div>
  );
}
