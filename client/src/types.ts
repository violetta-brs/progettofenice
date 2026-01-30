import type { Move, Color as PieceColor, PieceSymbol, Square } from "chess.js";

export type SquareState = {
  square: Square;
  type: PieceSymbol;
  color: PieceColor;
};
export type ChessJsBoard = (SquareState | null)[][];
export type Strategy = (moves: Move[]) => Move;
export type PlayerColor = "w" | "b";