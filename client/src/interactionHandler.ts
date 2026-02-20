import type { Square } from 'chess.js';
import { Chess } from 'chess.js';
import { postMove, postRandomMove } from './chessApi.js';
import { getPossibleMoves } from './chessUtils.js';

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

  async handleDragDrop(from: Square, to: Square): Promise<boolean> {
    const pezzo = this.game.get(from);
    if (!pezzo || pezzo.color !== this.game.turn()) {
      return false;
    }
    const res = await postMove(this.game.fen(), from, to);
    if (res.success && res.fen) {
      this.game.load(res.fen);
      this.selectedSquare = null;
      this.possibleMoves = [];
      this.updateState();
      return true;
    }
    return false;
  }

  handleSquareClick(casella: Square): boolean {
    if (this.selectedSquare === null) {
      const pezzo = this.game.get(casella);
      if (pezzo && pezzo.color === this.game.turn()) {
        this.selectedSquare = casella;
        this.possibleMoves = getPossibleMoves(this.game.fen(), casella);
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
      void this.applyMoveFromClick(this.selectedSquare, casella);
      return true;
    }

    const pezzo = this.game.get(casella);
    if (pezzo && pezzo.color === this.game.turn()) {
      this.selectedSquare = casella;
      this.possibleMoves = getPossibleMoves(this.game.fen(), casella);
      this.updateState();
      return false;
    }

    this.selectedSquare = null;
    this.possibleMoves = [];
    this.updateState();
    return false;
  }

  private async applyMoveFromClick(from: Square, to: Square): Promise<void> {
    const res = await postMove(this.game.fen(), from, to);
    if (res.success && res.fen) {
      this.game.load(res.fen);
      this.selectedSquare = null;
      this.possibleMoves = [];
      this.updateState();
    }
  }

  async makeComputerMove(): Promise<string | null> {
    const res = await postRandomMove(this.game.fen());
    if (res.success && res.fen) {
      this.game.load(res.fen);
      this.updateState();
      return res.move ?? null;
    }
    return null;
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
