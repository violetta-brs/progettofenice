export function randomChoice<T>(choices: T[]): T {
  if (choices.length <= 0)
    throw "Can't make a random choice because there is no choice";
  return choices[Math.floor(Math.random() * choices.length)];
}
