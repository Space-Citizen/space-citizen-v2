import { app } from "./pixi";
import { ICell, createMap } from "./map/createMap";
import { createCharacter } from "./character/character";

const startMap: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 1],
];

export async function initGame() {
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

  const cells = startMap.reduce<ICell[]>((map, row, y) => {
    row.forEach((cell, x) => {
      map.push({
        kind: cell === 1 ? "wall" : "floor",
        x,
        y,
      });
    });
    return map;
  }, []);

  const mapContainer = createMap(cells);
  mapContainer.x = 300;
  mapContainer.y = 300;
  app.stage.addChild(mapContainer);
  const character = await createCharacter();
  app.stage.addChild(character);
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        character.walk("up");
        break;
      case "ArrowDown":
        character.walk("down");
        break;
      case "ArrowLeft":
        character.walk("left");
        break;
      case "ArrowRight":
        character.walk("right");
        break;
    }
  });
  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        character.stop();
        break;
    }
  });
}
