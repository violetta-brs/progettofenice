import { useState } from "react"; 
import "./chessboard.scss";

const isDarkSquare = (rowIndex, colIndex) => {
  return (rowIndex + colIndex) % 2 === 1;
};

export default function ChessBoard({ board, onMove }) {
const [draggedFrom, setDraggedFrom] = useState(null);

const getSquareName = (rowIndex, colIndex) => {
  const colLetter = String.fromCharCode(97 + colIndex);
  return `${colLetter}${8 - rowIndex}`;
};

//inizio il trascinamento
 const handleDragStart = (e, rowIndex, colIndex) => {
  setDraggedFrom(getSquareName(rowIndex, colIndex));
};

  //rilascio la pedina
  const handleDrop = (e, rowIndex, colIndex) => {
    e.preventDefault();
    if (!draggedFrom) return;

    const targetSquare = getSquareName(rowIndex, colIndex);
  
      if (onMove) {
        onMove(draggedFrom, targetSquare);
      }

      setDraggedFrom(null);

  };

       const handleDragOver = (e) => {
      e.preventDefault();
    };

  const pieceImages = {
    w: {
      p: "/assets/chess/w_pawn.svg",
      r: "/assets/chess/w_rook.svg",
      n: "/assets/chess/w_knight.svg",
      b: "/assets/chess/w_bishop.svg",
      q: "/assets/chess/w_queen.svg",
      k: "/assets/chess/w_king.svg",
    },
    b: {
      p: "/assets/chess/b_pawn.svg",
      r: "/assets/chess/b_rook.svg",
      n: "/assets/chess/b_knight.svg",
      b: "/assets/chess/b_bishop.svg",
      q: "/assets/chess/b_queen.svg",
      k: "/assets/chess/b_king.svg",
    },
  };

  return (
    <div className="chessboard-container">
      <div className="chessboard">
        {board.map((row, rowIndex) =>
          row.map((square, colIndex) => {
            const isSquareDark = isDarkSquare(rowIndex, colIndex);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`square ${isSquareDark ? "dark" : "light"}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
              >
                {square && (
                  <img
                    src={pieceImages[square.color][square.type]}
                    alt={`${square.color === 'w' ? 'Bianco' : 'Nero'} ${square.type}`}
                    className="piece"
                    draggable={square.color === 'w'}
                    onDragStart={(e) => handleDragStart(e, rowIndex, colIndex)}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}