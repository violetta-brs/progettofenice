import type { Chess } from "chess.js";
import { WHITE, BLACK, type Color } from "chess.js";

function showColor(color: Color): string {
  return color === WHITE ? "Bianco" : "Nero";
}

export function makeGameOverMessage(
  game: Chess,
  timeoutWinner: Color | null,
): string {

  if (timeoutWinner) {
    return `Tempo scaduto: vince il ${showColor(timeoutWinner)}`;
  }

  if (game.isCheckmate()) {
    const winner = game.turn() === WHITE ? BLACK : WHITE;
    return `Scacco matto: vince il ${showColor(winner)}`;
  }

  if (game.isStalemate()) {
    return "Patta per stallo";
  }

  if (game.isDraw()) {
    return "Patta";
  }

  if (game.isGameOver()) {
    return "Game Over";
  }

  return "";
}

export function randomChoice<T>(choices: T[]): T {
  if (choices.length <= 0)
    throw "Can't make a random choice because there is no choice";
  return choices[Math.floor(Math.random() * choices.length)];
}

