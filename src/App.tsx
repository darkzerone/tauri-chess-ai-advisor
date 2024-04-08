import "./App.css";
import Board from "./components/board/Board";
import TipPrompt from "./components/tipPrompt/TipPrompt";
import { BoardProvider } from "./provider/boardProvider";

function App() {

  return (
    <>
      <BoardProvider>
        <Board />
        <TipPrompt />
      </BoardProvider>
    </>
  );
}

export default App;
