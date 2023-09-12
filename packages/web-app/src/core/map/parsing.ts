import { ICell } from "../types";

type SurroundingWallsMap = Record<
  "top" | "bottom" | "left" | "right" | "self",
  undefined | ICell
>;

export function parseMap(rawMap: number[][]): ICell[] {
  const cells = rawMap.reduce<ICell[]>((map, row, y) => {
    row.forEach((cell, x) => {
      const kind = cell === 1 ? "wall" : "floor";
      map.push({
        kind,
        assetName: "", // will be set later on
        x,
        y,
      });
    });
    return map;
  }, []);

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    (cell.assetName as string) = findCellAsset(cell, cells);
  }

  return cells;
}

function findCellAsset(cell: ICell, cells: ICell[]): string {
  return cell.kind === "wall"
    ? findWallType(cell.x, cell.y, cells)
    : findFloorType(cell.x, cell.y, cells);
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
    if (cell.kind !== "wall") {
      return;
    }
    if (cell.x === x && cell.y === y) {
      surroundingWalls.self = cell;
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
  return surroundingWalls;
}

function findFloorType(x: number, y: number, cells: ICell[]): string {
  const surroundingWalls = getSurroundingWalls(x, y, cells);
  if (surroundingWalls.self && surroundingWalls.top) {
    return "floor-shadow-corner";
  }
  if (surroundingWalls.self) {
    return "floor-shadow-left";
  }
  if (
    surroundingWalls.top &&
    surroundingWalls.top.assetName.includes("horizontal")
  ) {
    // special case for right-corner-top assets, we want a corner shadow
    if (surroundingWalls.top.assetName.includes("right-corner-top")) {
      return "floor-shadow-top-left-half";
    }
    return "floor-shadow-top";
  }
  return "floor";
}

function findWallType(x: number, y: number, cells: ICell[]): string {
  const surroundingWalls = getSurroundingWalls(x, y, cells);
  // if there is a wall to the left or right, it's a horizontal wall
  if (surroundingWalls.left && surroundingWalls.right) {
    if (surroundingWalls.bottom) {
      return "wall-horizontal-T";
    }
    return "wall-horizontal";
  }
  if (surroundingWalls.top && surroundingWalls.bottom) {
    if (surroundingWalls.right) {
      return "wall-vertical-T-right";
    }
    return "wall-vertical";
  }
  // if only a wall on the left
  if (surroundingWalls.left) {
    if (surroundingWalls.bottom) {
      return "wall-horizontal-end-right-corner-bottom";
    } else if (surroundingWalls.top) {
      return "wall-horizontal-end-right-corner-top";
    }
    return "wall-horizontal-end-right";
  }
  // if only a wall on the right
  if (surroundingWalls.right) {
    if (surroundingWalls.bottom) {
      return "wall-horizontal-end-left-corner-bottom";
    } else if (surroundingWalls.top) {
      return "wall-horizontal-end-left-corner-top";
    }
    return "wall-horizontal-end-left";
  }
  // if only a wall on the top
  if (surroundingWalls.top) {
    return "wall-vertical-end-bottom";
  }
  // if only a wall on the bottom
  if (surroundingWalls.bottom) {
    return "wall-vertical-end-top";
  }
  // if no walls around, it's a pillar
  return "wall-pillar";
}
