export type ChessBoard = Array<Array<ChessPieceString>>;

export type ChessPieceString =
  | "P"
  | "N"
  | "R"
  | "B"
  | "Q"
  | "K"
  | "p"
  | "n"
  | "b"
  | "r"
  | "q"
  | "k"
  | "";

export type ChessPieceUnicodeMap = {
  [key in ChessPieceString]: string;
};

export const chessPieceToUnicode: ChessPieceUnicodeMap = {
  P: "♟︎",
  N: "♞",
  B: "♝",
  R: "♜",
  Q: "♛",
  K: "♚",
  p: "♙",
  n: "♘",
  b: "♗",
  r: "♖",
  q: "♕",
  k: "♔",
  "": "",
};

export type AIChessResponse = {
    tip: string;
    moveToPerform: string;
}

export type ChessHistory = {
    [key: number]: ChessBoard
}