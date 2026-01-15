import { useState } from "react";
import { Chess } from "chess.js";
import ChessBoard from "./chessboard";

export default function RandomMove() {
    const [game, setGame] = useState(new Chess());

    const makeRandomMove = (currentGame) => {
        const possibleMoves = currentGame.moves();
        if (possibleMoves.length === 0) return; 
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            currentGame.move(randomMove);
            setGame(new Chess(currentGame.fen()));
        }

   //trascino la pedina e rilascio
   const handleMove = (source, target) => {
    try {
       const newGame = new Chess(game.fen());

       const move = newGame.move({ from: source, to: target, promotion: "q" });
       if (move) {
           setGame(newGame);
           
        const fen = newGame.fen();
         console.log("FEN attuale:", fen);

           setTimeout(() => {
               makeRandomMove(newGame);
           }, 500);

           return move;
       }

       return null;
    } catch {
       return null;
    }
   };

   return (
    <div className="random-move-container">
        <ChessBoard board={game.board()} onMove={handleMove} />
    </div>
  );
}