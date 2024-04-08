import { listen } from "@tauri-apps/api/event";
import { useState } from "react";
import classes from "./TipPrompt.module.css";

function TipPrompt() {
  const [prompt, setPrompt] = useState<string>("TIP!");

  listen("openai_response", async (event: { payload: string }) => {
    // const res: AIChessResponse = JSON.parse(
    //   event.payload.replace("'", '"') as unknown as string
    // );

    setPrompt(event.payload);
  });

  listen("openai_error", (event) => {
    console.error("Error calling OpenAI API:", event.payload);
  });

  return (
    <div>
      <div className={classes.container}>{prompt}</div>
      {/* <button onClick={() => promptAi()}>Next move</button> */}
    </div>
  );
}

export default TipPrompt;
