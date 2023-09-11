import * as React from "react";
import { initGame } from "./core/initGame";

export function App(): React.ReactElement {
  React.useEffect(() => {
    initGame();
  }, []);
  return <div>hello</div>;
}
