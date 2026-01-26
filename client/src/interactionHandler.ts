import type { Square } from 'chess.js';
import { Chess } from 'chess.js';
import { getPossibleMoves, makeMove, makeRandomMove } from '../../server/moveHandler.js';

export interface InteractionState {
  selectedSquare: Square | null;
  possibleMoves: Square[];
  game: Chess;
  fen: string;
}


export class ChessInteractionHandler {
  private game: Chess;
  private selectedSquare: Square | null = null;
  private possibleMoves: Square[] = [];
  private onStateChange?: (state: InteractionState) => void;

  
  constructor(fen?: string, onStateChange?: (state: InteractionState) => void) {
    this.game = new Chess(fen);
    if (onStateChange) {
      this.onStateChange = onStateChange;
    }
    this.updateState();
  }

  
  handleSquareClick(casella: Square): boolean {
      if (this.selectedSquare === null) {
      const pezzo = this.game.get(casella);
      if (pezzo && pezzo.color === this.game.turn()) {
        this.selectedSquare = casella;
        this.possibleMoves = getPossibleMoves(this.game, casella);
        this.updateState();
        return false;
      }
      return false;
    }

    if (this.selectedSquare === casella) {
      this.selectedSquare = null;
      this.possibleMoves = [];
      this.updateState();
      return false;
    }

    if (this.possibleMoves.includes(casella)) {
      try {
        makeMove(this.game, this.selectedSquare, casella);
        this.selectedSquare = null;
        this.possibleMoves = [];
        this.updateState();
        return true;
      } catch (error) {
        return false;
      }
    }

    const pezzo = this.game.get(casella);
    if (pezzo && pezzo.color === this.game.turn()) {
      this.selectedSquare = casella;
      this.possibleMoves = getPossibleMoves(this.game, casella);
      this.updateState();
      return false;
    }

    this.selectedSquare = null;
    this.possibleMoves = [];
    this.updateState();
    return false;
  }

  makeComputerMove(): string | null {
    try {
      const mossa = makeRandomMove(this.game);
      this.updateState();
      return mossa;
    } catch (error) {
      return null;
    }
  }

  resetGame() {
    this.game.reset();
    this.selectedSquare = null;
    this.possibleMoves = [];
    this.updateState();
  }

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

  getState(): InteractionState {
    return {
      selectedSquare: this.selectedSquare,
      possibleMoves: this.possibleMoves,
      game: this.game,
      fen: this.game.fen()
    };
  }

  private updateState() {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
  }

  getGame(): Chess {
    return this.game;
  }

  isSquareSelected(casella: Square): boolean {
    return this.selectedSquare === casella;
  }

  isPossibleMove(casella: Square): boolean {
    return this.possibleMoves.includes(casella);
  }
}
