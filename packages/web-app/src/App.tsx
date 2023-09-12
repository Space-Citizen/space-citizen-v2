import * as React from "react";
import "./App.module.css";
import { Controller, app } from "./core/controller";
import { UIController } from "./react-ui/UIController";

export function App(): React.ReactElement {
  React.useEffect(() => {
    // The application will create a canvas element for you that you
    // can then insert into the DOM

    const wrapper = document.createElement("div");
    wrapper.className = "game-canvas";

    wrapper.appendChild(app.view as HTMLCanvasElement);
    document.body.appendChild(wrapper);

    const controller = new Controller();

    return controller.destroy;
  }, []);

  return <UIController />;
}
