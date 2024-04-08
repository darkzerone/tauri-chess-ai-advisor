const letterToNumberMap = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
};

type IncludedLetter = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

export const convertChessMoveToArrayIndices = (move?: string) => {
  if (!move) return { from: [0, 0], to: [0, 0] };

  const [from, to] = move.split(",").map((s) => s.trim()) as IncludedLetter[];

  const fromColumn = letterToNumberMap[from[0] as IncludedLetter];
  const fromRow = 8 - parseInt(from[1]);

  const toColumn = letterToNumberMap[to[0] as IncludedLetter];
  const toRow = 8 - parseInt(to[1]);

  return { from: [fromRow, fromColumn], to: [toRow, toColumn] };
};
