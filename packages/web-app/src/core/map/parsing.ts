import { Sprite } from "pixi.js";
import { CellKind, FloorType, ICell, WallType } from "../types";
import { cellSize } from "../../constants";
import { IAnimation, createAnimation } from "../sprites/createAnimation";
import { random } from "../utils/math";

type SurroundingWallsMap = Record<
  "top" | "bottom" | "left" | "right" | "self",
  undefined | ICell<CellKind.wall> | ICell<CellKind.door>
>;

export async function parseMap(rawMap: number[][]): Promise<ICell[]> {
  const cells = rawMap.reduce<ICell[]>((map, row, y) => {
    row.forEach((cell, x) => {
      const kind = cell;
      map.push({
        kind,
        x,
        y,
        solid: kind === CellKind.wall || kind === CellKind.door,
        damage: 0,
      } as ICell); // casting to avoid setting asset now

      // add a floor cell under the wall (except if there is no cells on top or right side)
      if (
        (kind === CellKind.wall || kind === CellKind.door) &&
        rawMap[y][x + 1] !== undefined &&
        rawMap[y - 1]?.[x] !== undefined
      ) {
        map.push({
          kind: CellKind.floor,
          x,
          y,
          solid: false,
          damage: 0,
        } as ICell);
      }
    });
    return map;
  }, []);

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const previousWallCell = cells.find(
      (c) => c.x === cell.x - 1 && c.y === cell.y && c.kind === CellKind.wall
    );
    switch (cell.kind) {
      case CellKind.wall:
        cell.properties = {
          wallType: findWallType(cell, cells),
        };
        cell.properties.windowType = findWindowType(cell.properties);

        // windows work in pair, so if the previous cell is a window, we need to use the same damage value
        if ((cell as ICell<CellKind.wall>).properties.windowType === "right") {
          cell.damage = previousWallCell.damage;
        } else if (cell.properties.windowType) {
          cell.damage = random(0, 3); // windows have random amount of damage
        }
        if (cell.properties.wallType.includes("window")) {
          cell.asset = await createAnimation({
            frameSize: { width: 100, height: 200 },
            assetPath: `assets/walls/${cell.properties.wallType}.png`,
            animationNames: ["default"],
            idleAnimationName: "default",
            animationSettings: {
              "*": {
                animationSpeed: 0.1666,
                loop: false,
              },
            },
          });

          for (let i = cell.damage; i > 0; i--) {
            (cell.asset as IAnimation).nextFrame();
          }
          cell.asset.pivot.y = cell.asset.height / 2;
        } else {
          cell.asset = Sprite.from(
            `assets/walls/${cell.properties.wallType}.png`
          );
          (cell.asset as Sprite).anchor.y = cell.asset.height / 2;
        }
        cell.asset.zIndex = cell.y;
        break;
      case CellKind.floor:
        cell.properties = { floorType: findFloorType(cell, cells) };
        cell.asset = Sprite.from(
          `assets/floors/${
            (cell as ICell<CellKind.floor>).properties.floorType
          }.png`
        );
        cell.asset.zIndex = -1;
        break;
      case CellKind.door:
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
            const door = cell as ICell<CellKind.door>;
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

function findWindowType(wallProperties: ICell<CellKind.wall>["properties"]) {
  if (wallProperties.wallType === "horizontal-window-left") {
    return "left";
  }
  if (wallProperties.wallType === "horizontal-window-right") {
    return "right";
  }
  return undefined;
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
    if (cell.kind !== CellKind.wall && cell.kind !== CellKind.door) {
      return;
    }
    if (cell.x === x && cell.y === y) {
      surroundingWalls.self = cell as ICell<CellKind.wall>;
    }
    if (cell.x === x - 1 && cell.y === y) {
      surroundingWalls.left = cell as ICell<CellKind.wall>;
    }
    if (cell.x === x + 1 && cell.y === y) {
      surroundingWalls.right = cell as ICell<CellKind.wall>;
    }
    if (cell.x === x && cell.y === y - 1) {
      surroundingWalls.top = cell as ICell<CellKind.wall>;
    }
    if (cell.x === x && cell.y === y + 1) {
      surroundingWalls.bottom = cell as ICell<CellKind.wall>;
    }
  });
  return surroundingWalls;
}

function findFloorType({ x, y }: ICell, cells: ICell[]): FloorType {
  const surroundingWalls = getSurroundingWalls(x, y, cells);

  const topWallType = (surroundingWalls.top as ICell<CellKind.wall>)?.properties
    ?.wallType;

  const selfWallType = (surroundingWalls.self as ICell<CellKind.wall>)
    ?.properties?.wallType;

  if (
    surroundingWalls.self?.kind === CellKind.door ||
    selfWallType?.includes("window")
  ) {
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
      surroundingWalls.top.kind === CellKind.door)
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
    const leftWallType = (surroundingWalls.left as ICell<CellKind.wall>)
      .properties?.wallType;

    // if there is a window on the left, we must add the right part of that window
    if (leftWallType === "horizontal-window-left") {
      return "horizontal-window-right";
    }

    // check if there is a wall on the right of the right wall. If so, it's a long wall and we can add a window
    const isLongWall = !!cells.find(
      (c) =>
        surroundingWalls.right.x + 1 === c.x &&
        surroundingWalls.right.y === c.y &&
        c.kind === CellKind.wall
    );
    // add random chances to have a window on a long horizontal wall
    if (
      surroundingWalls.right.kind === CellKind.wall &&
      isLongWall &&
      random(0, 3) === 0
    ) {
      return "horizontal-window-left";
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
