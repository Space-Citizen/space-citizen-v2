import * as PIXI from "pixi.js";

type CellKind = "floor" | "wall";

export interface ICell<K extends CellKind = CellKind> {
  readonly kind: K;
  readonly x: number;
  readonly y: number;
}

const cellSize = 100;

function findWallType(x: number, y: number, cells: ICell[]): string {
  const surroundingWalls: Record<
    "top" | "bottom" | "left" | "right",
    undefined | ICell
  > = {
    top: undefined,
    bottom: undefined,
    left: undefined,
    right: undefined,
  };
  cells.forEach((cell) => {
    if (cell.kind !== "wall") {
      return;
    }
    if (cell.x === x - 1 && cell.y === y) {
      surroundingWalls.left = cell;
    }
    if (cell.x === x + 1 && cell.y === y) {
      surroundingWalls.right = cell;
    }
    if (cell.x === x && cell.y === y - 1) {
      surroundingWalls.top = cell;
    }
    if (cell.x === x && cell.y === y + 1) {
      surroundingWalls.bottom = cell;
    }
  });
  // if there is a wall to the left or right, it's a horizontal wall
  if (surroundingWalls.left && surroundingWalls.right) {
    return "horizontal";
  }
  if (surroundingWalls.top && surroundingWalls.bottom) {
    return "vertical";
  }
  // if only a wall on the left
  if (surroundingWalls.left) {
    return "horizontal-end-right";
  }
  // if only a wall on the right
  if (surroundingWalls.right) {
    return "horizontal-end-left";
  }
  // if only a wall on the top
  if (surroundingWalls.top) {
    return "vertical-end-bottom";
  }
  // if only a wall on the bottom
  if (surroundingWalls.bottom) {
    return "vertical-end-top";
  }
  // if no walls around, it's a pillar
  return "pillar";
}

export function createMap(cells: ICell[]): PIXI.Container {
  const container = new PIXI.Container();

  function addMapElement(cell: ICell) {
    let sprite: PIXI.Sprite;

    switch (cell.kind) {
      case "floor":
        sprite = PIXI.Sprite.from("assets/floor.png");
        sprite.zIndex = 0;
        break;
      case "wall":
        sprite = PIXI.Sprite.from(
          `assets/wall-${findWallType(cell.x, cell.y, cells)}.png`
        );
        sprite.zIndex = 999;
        // for walls, always add a floor tile underneath
        addMapElement({ ...cell, kind: "floor" });
        break;
      default:
        throw new Error(`Unknown cell kind: ${cell.kind}`);
    }
    sprite.x = cell.x * cellSize;
    sprite.y = cell.y * cellSize;
    sprite.anchor.set(0, 1);
    sprite.width = cellSize;

    container.addChild(sprite);
  }

  cells.forEach((cell) => {
    addMapElement(cell);
  });
  return container;
}
