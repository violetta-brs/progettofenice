import { useState } from "react";
import { Chess } from "chess.js";
import ChessBoard from "./chessboard";

export default function CasualMove() {
    const [game, setGame] = useState(new Chess());

    //creo una mossa casuale
    const makeRandomMove = (currentGame) => {
        const possibleMoves = currentGame.moves();
        if (possibleMoves.length === 0) return; //partita finita

            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            currentGame.move(randomMove);
            setGame(new Chess(currentGame.fen()));
    };

   //trascino la pedina e rilascio
   const handleMove = (source, target) => {
    try {
       const newGame = new Chess(game.fen());

       const move = newGame.move({ from: source, to: target, promotion: "q" });
       if (move) {
           setGame(newGame);
           
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

    <div className="casualmove-container">
        <ChessBoard board={game.board()} onMove={handleMove} />
    </div>
);

}
