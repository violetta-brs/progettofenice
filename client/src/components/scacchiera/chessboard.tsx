import type { Square } from "chess.js";
import { useState, type DragEvent } from "react";
import { toChessTurn } from "../../types";
import type {
  ChessJsBoard,
  ChessTurn,
  GameMode,
  PlayerColor,
  SquareState,
} from "../../types.ts";
import { ChessPiece } from "./chess-piece";
import "./chessboard.scss";

const isDarkSquare = (rowIndex: number, colIndex: number) => {
  return (rowIndex + colIndex) % 2 === 1;
};

const getSquareName = (rowIndex: number, colIndex: number): Square => {
  const colLetter = String.fromCharCode(97 + colIndex);
  return `${colLetter}${8 - rowIndex}` as Square;
};

export default function ChessBoard({
  board,
  onMove,
  activeColor,
  mode,
  playerColor,
}: {
  board: ChessJsBoard;
  onMove: (source: Square, target: Square) => void;
  activeColor: ChessTurn;
  mode: GameMode;
  playerColor: PlayerColor;
}) {
  const [draggedFrom, setDraggedFrom] = useState<Square | null>(null);
  const playerTurn = toChessTurn(playerColor);

  const handleDragStart = (
    _: DragEvent,
    rowIndex: number,
    colIndex: number,
  ) => {
    setDraggedFrom(getSquareName(rowIndex, colIndex));
  };

  const handleDrop = (e: DragEvent, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    if (!draggedFrom) return;

    const targetSquare = getSquareName(rowIndex, colIndex);

    if (onMove) {
      onMove(draggedFrom, targetSquare);
    }
    setDraggedFrom(null);
  };

  return (
    <div className="chessboard">
      {board.map((row, rowIndex: number) =>
        row.map((squareContent: SquareState | null, colIndex: number) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`square ${
              isDarkSquare(rowIndex, colIndex) ? "dark" : "light"
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
          >
            {squareContent && (
              <ChessPiece
                pieceSymbol={squareContent.type}
                pieceColor={squareContent.color}
                draggable={
                  mode === "player-vs-player"
                    ? squareContent.color === activeColor
                    : squareContent.color === playerTurn &&
                      activeColor === playerTurn
                }
                onDragStart={(e) => handleDragStart(e, rowIndex, colIndex)}
              />
            )}
          </div>
        )),
      )}
    </div>
  );
}
