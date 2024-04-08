import { useCallback, useContext, useEffect, useState } from "react";
import { BoardContext } from "../../provider/boardProvider";
import { ChessBoard, chessPieceToUnicode } from "../../types/chessTypes";
import classes from "./Board.module.css";
const numberToLetterMap = {
  0: "a",
  1: "b",
  2: "c",
  3: "d",
  4: "e",
  5: "f",
  6: "g",
  7: "h",
};

type IncludedNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

function Board() {
  const { board, updateMoveHistory } = useContext(BoardContext);
  const [activePiece, setActivePiece] = useState<string>("");
  const [chessBoardToDisplay, setChessBoardToDisplay] = useState<ChessBoard>(
    board || []
  );

  const updateChessBoard = useCallback(() => {
    setChessBoardToDisplay(board);
  }, [setChessBoardToDisplay, board]);

  useEffect(() => {
    if (board) {
      setChessBoardToDisplay(board);
    }
  }, [board, updateChessBoard]);
  
  const updateMove = (location: string) => {
    console.log(location)
    if(location === activePiece) {
      setActivePiece("");
      return;
    }
    
    if(activePiece.length === 0) {
      setActivePiece(location)
      return;
    }

    const from = activePiece;
    const to = location;

    updateMoveHistory(`${from},${to}`);

    setActivePiece("");
  }

  return (
    <div className={classes.board}>
      {chessBoardToDisplay?.map((row, rowIndex) => {
        const rowNumber = 8 - rowIndex;
        return (
          <div key={rowIndex} className={classes.row}>
            {row.map((cell, cellIndex) => {
              const rowLetter = numberToLetterMap[cellIndex as IncludedNumbers];
              return (
                <>
                  <div
                    key={cellIndex}
                    onClick={() => {
                      updateMove(`${rowLetter}${rowNumber}`);
                    }}
                    className={`${classes.cell} ${
                      (
                        rowIndex % 2 === 1
                          ? cellIndex % 2 === 0
                          : cellIndex % 2 === 1
                      )
                        ? classes.black
                        : classes.white
                    } ${cell.length !== 0 ?? classes.occupied}`}
                  >
                    {cellIndex === 0 && (
                      <div className={classes.number}>{rowNumber}</div>
                    )}
                    {rowIndex === 0 && (
                      <div className={classes.letter}>{rowLetter}</div>
                    )}
                    <span>{chessPieceToUnicode[cell] ?? ""}</span>
                  </div>
                </>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Board;
