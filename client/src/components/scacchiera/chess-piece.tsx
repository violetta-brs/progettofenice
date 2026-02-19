import type { Color as PieceColor, PieceSymbol } from "chess.js";
import { WHITE } from "chess.js";
import type { DragEvent, FC } from "react";

const pieceNames = {
  p: "pawn",
  r: "rook",
  n: "knight",
  b: "bishop",
  q: "queen",
  k: "king",
};

const getPieceImageUri = (color: PieceColor, piece: PieceSymbol) => {
  return `/assets/chess/${color}_${pieceNames[piece]}.svg`;
};

interface ChessPieceProps {
  pieceSymbol: PieceSymbol;
  pieceColor: PieceColor;
  onDragStart: (e: DragEvent) => void;
  draggable: boolean;
}

export const ChessPiece: FC<ChessPieceProps> = ({
  pieceSymbol,
  pieceColor,
  onDragStart,
  draggable,
}) => (
  <img
    src={getPieceImageUri(pieceColor, pieceSymbol)}
    alt={`${pieceColor === WHITE ? "Bianco" : "Nero"} ${pieceSymbol}`}
    className="piece"
    draggable={draggable}
    onDragStart={onDragStart}
  />
);
