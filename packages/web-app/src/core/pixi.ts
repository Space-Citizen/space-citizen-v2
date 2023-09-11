import { Application } from "pixi.js";

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
export const app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  resizeTo: window,
  backgroundColor: "#404059",
});
