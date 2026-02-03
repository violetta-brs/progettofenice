export function randomChoice<T>(choices: T[]): T {
  if (choices.length <= 0)
    throw "Can't make a random choice because there is no choice";
  return choices[Math.floor(Math.random() * choices.length)] as T;
}

export const formatTime = (totalSeconds: number): string => {
  /**
   * Formats a time interval to MM:SS
   * @param totalSeconds - a positive number of seconds representing a time interval
   */
  if (totalSeconds < 0)
    throw new Error(
      `Expected a non negative number of seconds as param but totalSeconds was ${totalSeconds} instead`,
    );
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const getOpponent = (color: PlayerColor): PlayerColor =>
  color === "WHITE" ? "BLACK" : "WHITE";
