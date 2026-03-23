import { Chess } from 'chess.js';
import type { Square } from 'chess.js';

export function getPossibleMoves(fen: string, square: Square): Square[] {
  const game = new Chess(fen);
  const moves = game.moves({ square, verbose: true });
  return moves.map((m) => m.to as Square);
}

export function isPromotionMove(fen: string, from: Square, to: Square): boolean {
  const game = new Chess(fen);
  const piece = game.get(from);
  if (!piece || piece.type !== 'p') return false;
  const toRank = to[1];
  if (piece.color === 'w' && toRank === '8') return true;
  if (piece.color === 'b' && toRank === '1') return true;
  return false;
}
