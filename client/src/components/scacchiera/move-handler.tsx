import { Chess, QUEEN, type Move, type Square } from "chess.js";
import { useState } from "react";
import { Strategy } from "../../types.ts";
import { randomChoice } from "../../utils.ts";
import ChessBoard from "./chessboard.tsx";

const randomStrategy: Strategy = (moves) => {
  return randomChoice(moves);
};

export default function MoveHandler() {
  const [fen, setFen] = useState(new Chess().fen());

  const makeMove = (
    currentGame: Chess,
    moveChoiceStrategy: (choices: Move[]) => Move = randomStrategy,
  ): void => {
    const possibleMoves = currentGame.moves({ verbose: true });
    if (possibleMoves.length === 0) return;
    currentGame.move(moveChoiceStrategy(possibleMoves));
    setFen(currentGame.fen());
  };

  const handlePlayerMove = (source: Square, target: Square) => {
    const newGame = new Chess(fen);
    const move = newGame.move({
      from: source as string,
      to: target,
      promotion: QUEEN,
    });
    if (!move) return null;
    setFen(newGame.fen());

    setTimeout(() => {
      makeMove(newGame);
    }, 500);

    return move;
  };

  return (
    <div className="move-handler-container">
      <ChessBoard board={new Chess(fen).board()} onMove={handlePlayerMove} />
    </div>
  );
}
