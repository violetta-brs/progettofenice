import { useEffect, useState } from "react";
import { BLACK, WHITE, type Color } from "chess.js";

type Props = {
  whiteBase: number;
  blackBase: number;
  activeColor: Color;
  turnStartedAt: number | null;
  isGameOver: boolean;
};

const formatTime = (totalSeconds: number) => {
  const seconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default function TimerDisplay({
  whiteBase,
  blackBase,
  activeColor,
  turnStartedAt,
  isGameOver,
}: Props) {

  const [now, setNow] = useState(() => Date.now());
  
  // update 1 volta al secondo
  useEffect(() => {
    if (isGameOver) return;

    setNow(Date.now());

    const tickIntervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(tickIntervalId);
    };
  }, [isGameOver, turnStartedAt]);

  const getShownMs = (color: Color) => {
    const baseMs = color === WHITE ? whiteBase : blackBase;

    if (isGameOver) return baseMs;
    if (color !== activeColor) return baseMs;
    if (turnStartedAt === null) return baseMs;

    return Math.max(0, baseMs - (now - turnStartedAt));
  };

  //arrotondamento per precisione timer
  const whiteSec = Math.ceil(getShownMs(WHITE) / 1000);
  const blackSec = Math.ceil(getShownMs(BLACK) / 1000);

  return (
    <div className="timer-display">
      <div>Bianco: {formatTime(whiteSec)}</div>
      <div>Nero: {formatTime(blackSec)}</div>
    </div>
  );
}
