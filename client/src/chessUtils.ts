import { Chess } from 'chess.js';
import type { Square } from 'chess.js';

/**
 * Restituisce le caselle di destinazione possibili per un pezzo nella posizione data.
 * Usato solo lato client per evidenziare le mosse (nessun round-trip al server).
 */
export function getPossibleMoves(fen: string, square: Square): Square[] {
  const game = new Chess(fen);
  const moves = game.moves({ square, verbose: true });
  return moves.map((m) => m.to as Square);
}
