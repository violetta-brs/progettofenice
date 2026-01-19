import { useState } from "react";
import { Chess } from "chess.js";
import ChessBoard from "./chessboard.tsx";

export default function RandomMove() {
    const [fen, setFen] = useState(new Chess().fen());
    const game = new Chess(fen);

    const makeRandomMove = (currentGame: Chess): void => {
        const possibleMoves = currentGame.moves();
        if (possibleMoves.length === 0) return; 
        
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        currentGame.move(randomMove);
        setFen(currentGame.fen());
    }

    // trascino la pedina e rilascio
    const handleMove = (source, target) => {
        try {
            const newGame = new Chess(fen);

            const move = newGame.move({ from: source, to: target, promotion: "q" });
            if (move) {
                setFen(newGame.fen());
            
                console.log("FEN attuale:", newGame.fen());

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