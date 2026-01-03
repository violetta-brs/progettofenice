import { useState } from "react";
import { Chess } from "chess.js";
import "./chessboard.scss";

export default function ChessBoard() {
  const [game] = useState(new Chess());
  const board = game.board();

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
            const isDarkSquare = (rowIndex + colIndex) % 2 === 1;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`square ${isDarkSquare ? "dark" : "light"}`}
              >
                {square && (
                  <img
                    src={pieceImages[square.color][square.type]}
                    alt={`${square.color === 'w' ? 'Bianco' : 'Nero'} ${square.type}`}
                    className="piece"
                    draggable="false"
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