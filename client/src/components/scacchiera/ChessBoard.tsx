import { useMemo } from 'react';
import type { Square, Piece } from 'chess.js';

const pieceImages = {
  w: {
    p: '/assets/chess/w_pawn.svg',
    r: '/assets/chess/w_rook.svg',
    n: '/assets/chess/w_knight.svg',
    b: '/assets/chess/w_bishop.svg',
    q: '/assets/chess/w_queen.svg',
    k: '/assets/chess/w_king.svg',
  },
  b: {
    p: '/assets/chess/b_pawn.svg',
    r: '/assets/chess/b_rook.svg',
    n: '/assets/chess/b_knight.svg',
    b: '/assets/chess/b_bishop.svg',
    q: '/assets/chess/b_queen.svg',
    k: '/assets/chess/b_king.svg',
  },
};

function getSquareName(rowIndex: number, colIndex: number): Square {
  const colLetter = String.fromCharCode(97 + colIndex);
  return `${colLetter}${8 - rowIndex}` as Square;
}

interface ChessBoardProps {
  board: (Piece | null)[][];
  selectedSquare: Square | null;
  possibleMoves: Square[];
  onDragStart?: (e: React.DragEvent, squareName: Square) => void;
  onDrop?: (e: React.DragEvent, squareName: Square) => void;
  onDragOver?: (e: React.DragEvent) => void;
}

export default function ChessBoard({ board, selectedSquare, possibleMoves, onDragStart, onDrop, onDragOver }: ChessBoardProps) {
  const boardArray = useMemo(() => {
    return board.map((row, rowIndex) =>
      row.map((square, colIndex) => ({
        square,
        squareName: getSquareName(rowIndex, colIndex),
        rowIndex,
        colIndex,
      }))
    );
  }, [board]);

  return (
    <div className="chessboard-container">
      <div className="chessboard">
        {boardArray.map((row) =>
          row.map(({ square, squareName, rowIndex, colIndex }) => {
            const isDarkSquare = (rowIndex + colIndex) % 2 === 1;
            const isSelected = selectedSquare === squareName;
            const isPossibleMove = possibleMoves.includes(squareName);
            const isDraggable = square && square.color === 'w';

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`square ${isDarkSquare ? 'dark' : 'light'} ${isSelected ? 'selected' : ''} ${isPossibleMove ? 'possible-move' : ''}`}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop && onDrop(e, squareName)}
              >
                {square && (
                  <img
                    src={pieceImages[square.color][square.type]}
                    alt={`${square.color === 'w' ? 'Bianco' : 'Nero'} ${square.type}`}
                    className="piece"
                    draggable={isDraggable}
                    onDragStart={(e) => onDragStart && onDragStart(e, squareName)}
                  />
                )}
                {isPossibleMove && !square && <div className="move-indicator" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
