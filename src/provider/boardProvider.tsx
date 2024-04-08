import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ChessBoard, ChessPieceString } from "../types/chessTypes";
import { convertChessMoveToArrayIndices } from "../helpers/convertMoveToArrayIndices";
import { invoke } from "@tauri-apps/api";

interface BoardContextType {
  board: ChessBoard;
  setBoard: React.Dispatch<React.SetStateAction<ChessBoard>>;
  moveHistory: string[];
  setMoveHistory: React.Dispatch<React.SetStateAction<string[]>>;
  whiteTurn: boolean;
  updateMoveHistory: (move: string) => void;
}

export const BoardContext = createContext<BoardContextType>({
  board: [],
  setBoard: () => {},
  moveHistory: [],
  setMoveHistory: () => {},
  whiteTurn: true,
  updateMoveHistory: () => {},
});

const setupChessBoard = () => {
  const backRankOrder: ChessPieceString[] = [
    "R",
    "N",
    "B",
    "Q",
    "K",
    "B",
    "N",
    "R",
  ];
  const pawn: ChessPieceString = "P";
  const emptySpace: ChessPieceString = "";

  const newBoard: ChessBoard = [];
  for (let i = 0; i < 8; i++) {
    const row: ChessPieceString[] = [];

    if (i === 0 || i === 7) {
      newBoard.push(
        i === 0
          ? backRankOrder
          : backRankOrder.map(
              (piece) => piece.toLowerCase() as ChessPieceString
            )
      );
    } else {
      for (let j = 0; j < 8; j++) {
        if (i === 1 || i === 6) {
          row.push(i === 1 ? pawn : (pawn.toLowerCase() as ChessPieceString));
        } else {
          row.push(emptySpace);
        }
      }

      newBoard.push(row);
    }
  }

  return newBoard;
};

export const BoardProvider: FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren) => {
  const [board, setBoard] = useState<ChessBoard>(setupChessBoard());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [whiteTurn, setWhiteTurn] = useState<boolean>(true);

  const promptAi = useCallback(
    (newMoveHistory: string[], board:ChessBoard) => {
      const promptToSend = {
        currentChessBoardState: board,
        moveHistory: newMoveHistory,
        playerTurn: !whiteTurn ? "W" : "B",
      };

      invoke("call_openai_api", { prompt: JSON.stringify(promptToSend) });
    },
    [whiteTurn]
  );

  const updateBoard = useCallback(
    (from: number[], to: number[], moveHistory: string[]) => {
      setBoard((prev: ChessBoard) => {
        const newBoard = prev.map((row) => [...row]);

        const pieceToMove = newBoard[Number(from[0])][Number(from[1])];
        newBoard[Number(to[0])][Number(to[1])] = pieceToMove;
        newBoard[Number(from[0])][Number(from[1])] = "";

        promptAi(moveHistory, newBoard);
        return newBoard.map((row) => [...row]);
      });
    },
    [promptAi]
  );

  const updateMoveHistory = useCallback(
    // move is in the format "a1, a2"
    (move: string) => {
      setMoveHistory((prevMoveHistory: string[]) => {
        if (prevMoveHistory.length > 0) {
          const lastMove = prevMoveHistory[prevMoveHistory.length - 1];
          if (lastMove === move) {
            return prevMoveHistory;
          }
        }

        const { from, to } = convertChessMoveToArrayIndices(move);
        const updateMoveHistory = [...prevMoveHistory, move];

        updateBoard(from, to, updateMoveHistory);

        return updateMoveHistory;
      });
    },
    [updateBoard]
  );

  useEffect(() => {
    setWhiteTurn(moveHistory.length % 2 === 0);
  }, [moveHistory.length]);

  return (
    <BoardContext.Provider
      value={{
        board,
        setBoard,
        moveHistory,
        setMoveHistory,
        whiteTurn,
        updateMoveHistory,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
