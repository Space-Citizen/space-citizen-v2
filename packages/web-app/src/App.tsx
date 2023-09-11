import * as React from "react";
import { Controller, app } from "./core/controller";

export function App(): React.ReactElement {
  React.useEffect(() => {
    // The application will create a canvas element for you that you
    // can then insert into the DOM

    const wrapper = document.createElement("div");
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";
    wrapper.style.position = "absolute";
    wrapper.style.top = "0";
    wrapper.style.left = "0";

    wrapper.appendChild(app.view as HTMLCanvasElement);
    document.body.appendChild(wrapper);

    const controller = new Controller();

    return controller.destroy;
  }, []);
  return <div>hello</div>;
}
