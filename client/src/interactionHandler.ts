import type { Square } from 'chess.js';
import { Chess } from 'chess.js';
import { getGameStatus, getPossibleMoves, makeMove, makeRandomMove, type MoveResult } from '../../server/moveHandler.js';

export interface InteractionState {
  selectedSquare: string | null; // casella selezionata
  possibleMoves: string[]; // dove posso muovermi
  game: Chess; // il gioco
  gameStatus: ReturnType<typeof getGameStatus>; // stato (scacco, matto, ecc.)
}


export class ChessInteractionHandler {
  private game: Chess;
  private selectedSquare: string | null = null;
  private possibleMoves: string[] = [];
  private onStateChange?: (state: InteractionState) => void;

  
  constructor(fen?: string, onStateChange?: (state: InteractionState) => void) {
    this.game = new Chess(fen);
    if (onStateChange) {
      this.onStateChange = onStateChange;
    }
    this.updateState();
  }

  
  handleSquareClick(casella: string): boolean {
      // Se non ho selezionato niente
      if (this.selectedSquare === null) {
      const pezzo = this.game.get(casella as Square);
      // Se c'è un pezzo e è il mio turno, lo seleziono
      if (pezzo && pezzo.color === this.game.turn()) {
        this.selectedSquare = casella;
        this.possibleMoves = getPossibleMoves(this.game, casella);
        this.updateState();
        return false;
      }
      return false;
    }

    // Se clicco di nuovo sulla stessa casella, deseleziono
    if (this.selectedSquare === casella) {
      this.selectedSquare = null;
      this.possibleMoves = [];
      this.updateState();
      return false;
    }

    // Se clicco dove posso muovermi, faccio la mossa
    if (this.possibleMoves.includes(casella)) {
      const risultato = makeMove(this.game, this.selectedSquare, casella);
      if (risultato.success) {
        this.selectedSquare = null;
        this.possibleMoves = [];
        this.updateState();
        return true;
      }
    }

    // Se clicco su un altro mio pezzo, cambio selezione
    const pezzo = this.game.get(casella as Square);
    if (pezzo && pezzo.color === this.game.turn()) {
      this.selectedSquare = casella;
      this.possibleMoves = getPossibleMoves(this.game, casella);
      this.updateState();
      return false;
    }

    // Altrimenti deseleziono
    this.selectedSquare = null;
    this.possibleMoves = [];
    this.updateState();
    return false;
  }

  // Il computer fa una mossa
  makeComputerMove(): MoveResult {
    const risultato = makeRandomMove(this.game);
    if (risultato.success) {
      this.updateState();
    }
    return risultato;
  }

  // Ricomincia da capo
  resetGame() {
    this.game.reset();
    this.selectedSquare = null;
    this.possibleMoves = [];
    this.updateState();
  }

  // Carica una posizione
  loadFen(fen: string) {
    try {
      this.game.load(fen);
      this.selectedSquare = null;
      this.possibleMoves = [];
      this.updateState();
    } catch (errore) {
      console.error('Errore:', errore);
    }
  }

  // Ritorna lo stato
  getState(): InteractionState {
    return {
      selectedSquare: this.selectedSquare,
      possibleMoves: this.possibleMoves,
      game: this.game,
      gameStatus: getGameStatus(this.game)
    };
  }

  // Aggiorna lo stato
  private updateState() {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
  }

  // Ritorna il gioco
  getGame(): Chess {
    return this.game;
  }

  // Controlla se una casella è selezionata
  isSquareSelected(casella: string): boolean {
    return this.selectedSquare === casella;
  }

  // Controlla se posso muovermi lì
  isPossibleMove(casella: string): boolean {
    return this.possibleMoves.includes(casella);
  }
}
