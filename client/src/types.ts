import type { Move, Color as PieceColor, PieceSymbol, Square } from "chess.js";

export type SquareState = {
  square: Square;
  type: PieceSymbol;
  color: PieceColor;
};
export type ChessJsBoard = (SquareState | null)[][];
export type Strategy = (moves: Move[]) => Move;
export type GameMode = "player-vs-computer" | "player-vs-player";
// WHITE e BLACK per i colori dei giocatori
export type PlayerColor = "WHITE" | "BLACK";
// chess.js usa w e b per i turni dei giocatori
export type ChessTurn = "w" | "b";
export const toChessTurn = (c: PlayerColor): ChessTurn =>
  c === "WHITE" ? "w" : "b"; 
export const fromChessTurn = (t: ChessTurn): PlayerColor =>
  t === "w" ? "WHITE" : "BLACK";
