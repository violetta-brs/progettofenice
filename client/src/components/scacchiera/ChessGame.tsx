import { useState, useEffect, useRef } from 'react';
import type { Square } from 'chess.js';
import { ChessInteractionHandler, type InteractionState, type PromotionPiece } from '../../interactionHandler';
import { isPromotionMove } from '../../chessUtils.js';
import ChessBoard from './ChessBoard';

interface ChessGameProps {
  autoComputerMove?: boolean;
  computerMoveDelay?: number;
  initialFen?: string;
}

const PROMOTION_PIECES: { value: PromotionPiece; label: string }[] = [
  { value: 'q', label: 'Donna' },
  { value: 'r', label: 'Torre' },
  { value: 'b', label: 'Alfiere' },
  { value: 'n', label: 'Cavallo' },
];

export default function ChessGame({ 
  autoComputerMove = true, 
  computerMoveDelay = 500,
  initialFen 
}: ChessGameProps) {
  const [state, setState] = useState<InteractionState | null>(null);
  const [promotionModal, setPromotionModal] = useState<{ from: Square; to: Square } | null>(null);
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
    if (!draggedFromRef.current || !handlerRef.current || !state) return;
    const from = draggedFromRef.current;
    draggedFromRef.current = null;
    if (isPromotionMove(state.fen, from, targetSquare)) {
      setPromotionModal({ from, to: targetSquare });
      return;
    }
    await handlerRef.current.handleDragDrop(from, targetSquare);
  };

  const handleSquareClick = (squareName: Square) => {
    if (!handlerRef.current) return;
    const result = handlerRef.current.handleSquareClick(squareName);
    if (result.promotionRequired) {
      setPromotionModal({ from: result.from, to: result.to });
    }
  };

  const handlePromotionChoose = async (piece: PromotionPiece) => {
    if (!promotionModal || !handlerRef.current) return;
    await handlerRef.current.completeMove(promotionModal.from, promotionModal.to, piece);
    setPromotionModal(null);
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
        onSquareClick={handleSquareClick}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      />
      {promotionModal && (
        <div className="promotion-modal-overlay" role="dialog" aria-label="Scegli pezzo per la promozione">
          <div className="promotion-modal">
            <p>Scegli in cosa promuovere il pedone:</p>
            <div className="promotion-buttons">
              {PROMOTION_PIECES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handlePromotionChoose(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="chess-game-info">
        <p>Turno: {state.game.turn() === 'w' ? 'Bianco' : 'Nero'}</p>
        <p>FEN: {state.fen}</p>
      </div>
    </div>
  );
}
