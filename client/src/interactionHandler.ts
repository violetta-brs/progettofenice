import type { Square } from 'chess.js';
import { Chess } from 'chess.js';
import { postMove, postRandomMove } from './chessApi.js';
import { getPossibleMoves, isPromotionMove } from './chessUtils.js';

export type PromotionPiece = 'q' | 'r' | 'b' | 'n';

export type SquareClickResult =
  | { promotionRequired: true; from: Square; to: Square }
  | { promotionRequired: false };

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

  async completeMove(from: Square, to: Square, promotion?: PromotionPiece): Promise<boolean> {
    const res = await postMove(this.game.fen(), from, to, promotion);
    if (res.success && res.fen) {
      this.game.load(res.fen);
      this.selectedSquare = null;
      this.possibleMoves = [];
      this.updateState();
      return true;
    }
    return false;
  }

  async handleDragDrop(from: Square, to: Square, promotion?: PromotionPiece): Promise<boolean> {
    const pezzo = this.game.get(from);
    if (!pezzo || pezzo.color !== this.game.turn()) {
      return false;
    }
    return this.completeMove(from, to, promotion);
  }

  handleSquareClick(casella: Square): SquareClickResult {
    if (this.selectedSquare === null) {
      const pezzo = this.game.get(casella);
      if (pezzo && pezzo.color === this.game.turn()) {
        this.selectedSquare = casella;
        this.possibleMoves = getPossibleMoves(this.game.fen(), casella);
        this.updateState();
        return { promotionRequired: false };
      }
      return { promotionRequired: false };
    }

    if (this.selectedSquare === casella) {
      this.selectedSquare = null;
      this.possibleMoves = [];
      this.updateState();
      return { promotionRequired: false };
    }

    if (this.possibleMoves.includes(casella)) {
      const from = this.selectedSquare;
      const to = casella;
      if (isPromotionMove(this.game.fen(), from, to)) {
        return { promotionRequired: true, from, to };
      }
      void this.applyMoveFromClick(from, to);
      return { promotionRequired: false };
    }

    const pezzo = this.game.get(casella);
    if (pezzo && pezzo.color === this.game.turn()) {
      this.selectedSquare = casella;
      this.possibleMoves = getPossibleMoves(this.game.fen(), casella);
      this.updateState();
      return { promotionRequired: false };
    }

    this.selectedSquare = null;
    this.possibleMoves = [];
    this.updateState();
    return { promotionRequired: false };
  }

  private async applyMoveFromClick(from: Square, to: Square): Promise<void> {
    await this.completeMove(from, to);
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
