import * as React from "react";
import "./App.module.css";
import { GameCore, app } from "./core/core";
import { UIController } from "./react-ui/UIController";
import { airLeakMaxDuration } from "./constants";

const controller = new GameCore();
let airTimeout: number;

export function App(): React.ReactElement {
  React.useEffect(() => {
    // The application will create a canvas element for you that you
    // can then insert into the DOM

    const wrapper = document.createElement("div");
    wrapper.className = "game-canvas";

    wrapper.appendChild(app.view as HTMLCanvasElement);
    document.body.appendChild(wrapper);

    controller.init();

    airTimeout = window.setTimeout(() => {
      controller.lose("air");
    }, airLeakMaxDuration);

    return controller.destroy;
  }, []);

  const onDeath = React.useCallback(() => {
    clearTimeout(airTimeout);
    controller.lose("hp");
  }, []);

  return <UIController onDeath={onDeath} />;
}
