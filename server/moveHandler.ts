import { Chess, Square } from 'chess.js';

export class NoMovesAvailableError extends Error {
  constructor() {
    super('Nessuna mossa disponibile');
    this.name = 'NoMovesAvailableError';
  }
}

export class InvalidMoveError extends Error {
  constructor() {
    super('Mossa non valida');
    this.name = 'InvalidMoveError';
  }
}

export function makeRandomMove(game: Chess): string {
  const mosse = game.moves({ verbose: true });
  
  if (mosse.length === 0) {
    throw new NoMovesAvailableError();
  }

  const numero = Math.floor(Math.random() * mosse.length);
  const mossa = mosse[numero];

  const risultato = game.move({
    from: mossa.from,
    to: mossa.to,
    promotion: mossa.promotion
  });

  if (!risultato) {
    throw new InvalidMoveError();
  }

  return risultato.san;
}

export function isValidMove(game: Chess, da: Square, a: Square): boolean {
  const mossa = game.move({
    from: da,
    to: a
  });
  
  if (mossa) {
    game.undo();
    return true;
  }
  
  return false;
}

export function makeMove(game: Chess, da: Square, a: Square, promozione?: string): string {
  const risultato = game.move({
    from: da,
    to: a,
    promotion: promozione as any
  });

  if (!risultato) {
    throw new InvalidMoveError();
  }

  return risultato.san;
}

export function getPossibleMoves(game: Chess, casella: Square): Square[] {
  const mosse = game.moves({ square: casella, verbose: true });
  return mosse.map((m) => m.to as Square);
}

