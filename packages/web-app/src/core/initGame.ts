import { app } from "./pixi";
import { ICell, createMap } from "./map/createMap";
import { createCharacter } from "./character/character";

const startMap: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1],
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
  mapContainer.pivot.x = mapContainer.width / 2;
  mapContainer.pivot.y = mapContainer.height / 2;
  mapContainer.x = app.view.width / 2;
  mapContainer.y = app.view.height / 2;

  const character = await createCharacter();
  character.x = mapContainer.x / 2;
  character.y = mapContainer.y / 2;
  character.pivot.x = character.width / 2;
  character.pivot.y = character.height / 2;

  // sort based on zIndex
  mapContainer.sortableChildren = true;
  mapContainer.addChild(character);
  app.stage.addChild(mapContainer);
  const pressedKeys = new Set();

  function moveCharacter() {
    const key = pressedKeys.values().next().value;
    const shouldShoot = pressedKeys.has(" ");
    const shootDirection = pressedKeys.has("ArrowLeft")
      ? "left"
      : pressedKeys.has("ArrowRight")
      ? "right"
      : undefined;

    if (shouldShoot && shootDirection) {
      character.shoot(shootDirection);
      return;
    }

    switch (key) {
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
  }

  window.addEventListener("keydown", (e) => {
    pressedKeys.add(e.key);
    moveCharacter();
  });

  window.addEventListener("keyup", (e) => {
    pressedKeys.delete(e.key);
    switch (e.key) {
      case " ":
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        character.stop();
        moveCharacter();
        break;
    }
  });
}
