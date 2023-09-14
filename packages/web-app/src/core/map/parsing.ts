import { Sprite } from "pixi.js";
import { FloorType, ICell, WallType } from "../types";
import { cellSize } from "../../constants";
import { IAnimation, createAnimation } from "../sprites/createAnimation";

type SurroundingWallsMap = Record<
  "top" | "bottom" | "left" | "right" | "self",
  undefined | ICell<"wall"> | ICell<"door">
>;

export async function parseMap(rawMap: number[][]): Promise<ICell[]> {
  const cells = rawMap.reduce<ICell[]>((map, row, y) => {
    row.forEach((cell, x) => {
      const kind = cell === 1 ? "wall" : cell === 2 ? "door" : "floor";
      map.push({
        kind,
        x,
        y,
        solid: kind === "wall" || kind === "door",
      } as ICell); // casting to avoid setting asset now

      // add a floor cell under the wall (except if there is no cells on the right side)
      if (
        (kind === "wall" || kind === "door") &&
        rawMap[y][x + 1] !== undefined
      ) {
        map.push({
          kind: "floor",
          x,
          y,
          solid: false,
        } as ICell);
      }
    });
    return map;
  }, []);

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    switch (cell.kind) {
      case "wall":
        cell.properties = { wallType: findWallType(cell, cells) };
        cell.asset = Sprite.from(
          `assets/walls/${(cell as ICell<"wall">).properties.wallType}.png`
        );
        cell.asset.zIndex = cell.y;
        (cell.asset as Sprite).anchor.y = cell.asset.height / 2;
        break;
      case "floor":
        cell.properties = { floorType: findFloorType(cell, cells) };
        cell.asset = Sprite.from(
          `assets/floors/${(cell as ICell<"floor">).properties.floorType}.png`
        );
        cell.asset.zIndex = -1;
        break;
      case "door":
        cell.asset = await createAnimation({
          frameSize: { width: 100, height: 200 },
          assetPath: "assets/door.png",
          animationNames: ["open", "close"],
          idleAnimationName: "open",
          animationSettings: {
            "*": {
              animationSpeed: 0.1666,
              loop: false,
            },
          },
        });
        cell.properties = {
          open: false,
          toggle: () => {
            const door = cell as ICell<"door">;
            if (!door.properties.open) {
              door.properties.open = true;
              door.solid = false;
              (door.asset as IAnimation).switchAnimation("open");
              (door.asset as IAnimation).play();
            } else if (door.properties.open) {
              door.properties.open = false;
              door.solid = true;
              (door.asset as IAnimation).switchAnimation("close");
              (door.asset as IAnimation).play();
            }
          },
        };
        cell.asset.zIndex = cell.y;
        cell.asset.pivot.y = cell.asset.height / 2;
        break;
    }
    cell.asset.x = cell.x * cellSize;
    cell.asset.y = cell.y * cellSize;
  }

  return cells;
}

function getSurroundingWalls(
  x: number,
  y: number,
  cells: ICell[]
): SurroundingWallsMap {
  const surroundingWalls: SurroundingWallsMap = {
    top: undefined,
    bottom: undefined,
    left: undefined,
    right: undefined,
    self: undefined,
  };
  cells.forEach((cell) => {
    if (cell.kind !== "wall" && cell.kind !== "door") {
      return;
    }
    if (cell.x === x && cell.y === y) {
      surroundingWalls.self = cell as ICell<"wall">;
    }
    if (cell.x === x - 1 && cell.y === y) {
      surroundingWalls.left = cell as ICell<"wall">;
    }
    if (cell.x === x + 1 && cell.y === y) {
      surroundingWalls.right = cell as ICell<"wall">;
    }
    if (cell.x === x && cell.y === y - 1) {
      surroundingWalls.top = cell as ICell<"wall">;
    }
    if (cell.x === x && cell.y === y + 1) {
      surroundingWalls.bottom = cell as ICell<"wall">;
    }
  });
  return surroundingWalls;
}

function findFloorType({ x, y }: ICell, cells: ICell[]): FloorType {
  const surroundingWalls = getSurroundingWalls(x, y, cells);

  const topWallType = (surroundingWalls.top as ICell<"wall">)?.properties
    ?.wallType;

  if (surroundingWalls.self?.kind === "door") {
    return "floor";
  }

  if (surroundingWalls.self) {
    if (
      (topWallType?.includes("horizontal") || topWallType === "vertical-T") &&
      topWallType !== "horizontal-right-corner-bottom"
    ) {
      return "floor-shadow-corner";
    } else {
      return "floor-shadow-left";
    }
  }
  if (
    surroundingWalls.top &&
    (topWallType?.includes("horizontal") ||
      surroundingWalls.top.kind === "door")
  ) {
    // special case for right-corner-top assets, we want a corner shadow
    if (topWallType === "horizontal-right-corner-top") {
      return "floor-shadow-top-left";
    }
    return "floor-shadow-top";
  }
  return "floor";
}

function findWallType({ x, y }: ICell, cells: ICell[]): WallType {
  const surroundingWalls = getSurroundingWalls(x, y, cells);
  // if there is a wall to the left or right, it's a horizontal wall
  if (surroundingWalls.left && surroundingWalls.right) {
    if (surroundingWalls.bottom) {
      return "horizontal-T";
    }
    return "horizontal";
  }
  if (surroundingWalls.top && surroundingWalls.bottom) {
    if (surroundingWalls.right) {
      return "vertical-T";
    }
    return "vertical";
  }
  // if only a wall on the left
  if (surroundingWalls.left) {
    if (surroundingWalls.bottom) {
      return "horizontal-right-corner-bottom";
    } else if (surroundingWalls.top) {
      return "horizontal-right-corner-top";
    }
    return "horizontal-right";
  }
  // if only a wall on the right
  if (surroundingWalls.right) {
    if (surroundingWalls.bottom) {
      return "horizontal-left-corner-bottom";
    } else if (surroundingWalls.top) {
      return "horizontal-left-corner-top";
    }
    return "horizontal-left";
  }
  // if only a wall on the top
  if (surroundingWalls.top) {
    return "vertical-bottom";
  }
  // if only a wall on the bottom
  if (surroundingWalls.bottom) {
    return "vertical-top";
  }
  // if no walls around, it's a pillar
  return "pillar";
}
