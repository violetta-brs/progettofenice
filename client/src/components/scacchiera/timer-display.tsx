import { useEffect, useState } from "react";
import type { PlayerColor } from "../../types";

type Props = {
  whiteBase: number;
  blackBase: number;
  activeColor: PlayerColor;
  turnStartedAt: number | null;
  isGameOver: boolean;
};

const formatTime = (seconds: number) => {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export default function TimerDisplay({
  whiteBase,
  blackBase,
  activeColor,
  turnStartedAt,
  isGameOver,
}: Props) {
  const [now, setNow] = useState(Date.now());

  // aggiornamento istantaneo del timer all'inizio del turno
  useEffect(() => {
    setNow(Date.now());
  }, [turnStartedAt, activeColor]);

  // timer che si aggiorna ogni secondo / tempo reale
  useEffect(() => {
    if (isGameOver) return;

    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => clearInterval(timerId);
  }, [isGameOver]);

  const getShown = (color: PlayerColor) => {
    const base = color === "WHITE" ? whiteBase : blackBase;

    if (isGameOver) return base;
    if (color !== activeColor) return base;
    if (!turnStartedAt) return base;

    const elapsed = (now - turnStartedAt) / 1000;
    return Math.max(0, Math.floor(base - elapsed));
  };

  return (
    <div className="timer-display">
      <div>Bianco: {formatTime(getShown("WHITE"))}</div>
      <div>Nero: {formatTime(getShown("BLACK"))}</div>
    </div>
  );
}
