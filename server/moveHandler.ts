import { Chess, Square } from 'chess.js';

// Quando faccio una mossa, questa è la risposta che ottengo
export interface MoveResult {
  success: boolean; // true = mossa fatta, false = errore
  move: string | null; // la mossa (es. "e4") oppure null
  error?: string; // messaggio di errore se qualcosa va storto
  fen?: string; // la posizione della scacchiera
}

// Fa una mossa a caso
export function makeRandomMove(game: Chess): MoveResult {
  // Prendo tutte le mosse che posso fare
  const mosse = game.moves({ verbose: true });
  
  // Se non ci sono mosse, errore
  if (mosse.length === 0) {
    return {
      success: false,
      move: null,
      error: 'Nessuna mossa disponibile',
      fen: game.fen()
    };
  }

  // Scelgo un numero a caso
  const numero = Math.floor(Math.random() * mosse.length);
  const mossa = mosse[numero];

  // Faccio la mossa
  const risultato = game.move({
    from: mossa.from,
    to: mossa.to,
    promotion: mossa.promotion
  });

  // Se è andata bene
  if (risultato) {
    return {
      success: true,
      move: risultato.san,
      fen: game.fen()
    };
  }

  // Se non è andata bene
  return {
    success: false,
    move: null,
    error: 'Mossa non valida',
    fen: game.fen()
  };
}

// Controlla se posso fare una mossa
export function isValidMove(game: Chess, da: string, a: string): boolean {
  // Provo a fare la mossa
  const mossa = game.move({
    from: da as Square,
    to: a as Square
  });
  
  // Se funziona, la annullo e dico che è valida
  if (mossa) {
    game.undo();
    return true;
  }
  
  // Se non funziona, non è valida
  return false;
}

// Fa una mossa
export function makeMove(game: Chess, da: string, a: string, promozione?: string): MoveResult {
  // Provo a fare la mossa
  const risultato = game.move({
    from: da as Square,
    to: a as Square,
    promotion: promozione as any
  });

  // Se è andata bene
  if (risultato) {
    return {
      success: true,
      move: risultato.san,
      fen: game.fen()
    };
  }

  // Se non è andata bene
  return {
    success: false,
    move: null,
    error: 'Mossa non valida',
    fen: game.fen()
  };
}

// Dice dove può andare un pezzo
export function getPossibleMoves(game: Chess, casella: string): string[] {
  // Prendo tutte le mosse da quella casella
  const mosse = game.moves({ square: casella as Square, verbose: true });
  // Ritorno solo le caselle di destinazione
  return mosse.map((m: { to: string }) => m.to);
}

// Dice come sta il gioco
export function getGameStatus(game: Chess) {
  return {
    isCheck: game.isCheck(), // scacco?
    isCheckmate: game.isCheckmate(), // scacco matto?
    isStalemate: game.isStalemate(), // patta?
    isDraw: game.isDraw(), // patta?
    isGameOver: game.isGameOver(), // finito?
    turn: game.turn(), // chi muove? 'w' o 'b'
    fen: game.fen() // posizione
  };
}
