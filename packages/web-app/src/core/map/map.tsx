import * as PIXI from "pixi.js";
import { cellSize } from "../../constants";

type CellKind = "floor" | "wall";

type SurroundingWallsMap = Record<
  "top" | "bottom" | "left" | "right" | "self",
  undefined | ICell
>;

export interface ICell<K extends CellKind = CellKind> {
  readonly kind: K;
  readonly assetName: string;
  readonly x: number;
  readonly y: number;
}

export class Map {
  public container = new PIXI.Container();
  private readonly cells: ICell[];

  constructor(public readonly rawMap: number[][]) {
    this.cells = rawMap.reduce<ICell[]>((map, row, y) => {
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

    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      (cell.assetName as string) = this.findCellAsset(cell);
    }

    this.cells.forEach((cell) => {
      this.addMapElement(cell);
    });
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
    this.container.sortableChildren = true;
  }

  public isWall(x: number, y: number): boolean {
    const xCell = Math.round(x / cellSize);
    const yCell = Math.ceil(y / cellSize);
    return (
      this.cells.find((c) => c.x === xCell && c.y === yCell)?.kind === "wall"
    );
  }

  private addMapElement(cell: ICell) {
    let sprite: PIXI.Sprite;

    switch (cell.kind) {
      case "floor":
        sprite = PIXI.Sprite.from(`assets/${cell.assetName}.png`);
        sprite.zIndex = 0;
        break;
      case "wall":
        sprite = PIXI.Sprite.from(`assets/${cell.assetName}.png`);
        sprite.zIndex = cell.y;
        const cellAbove = this.cells.find(
          (c) => c.x === cell.x && c.y === cell.y - 1
        );
        // for walls, always add a floor tile underneath
        !this.isEndOfRow(cell) &&
          this.addMapElement({
            ...cell,
            kind: "floor",
            assetName:
              // if the cell above is an horizontal wall, add a corner shadow

              cellAbove?.assetName.includes("horizontal") ||
              cellAbove?.assetName.includes("wall-vertical-T-right")
                ? "floor-shadow-corner"
                : // otherwise, just use a regular left shadow
                  "floor-shadow-left",
          });
        break;
      default:
        throw new Error(`Unknown cell kind: ${cell.kind}`);
    }
    sprite.x = cell.x * cellSize;
    sprite.y = cell.y * cellSize;
    sprite.anchor.set(0, 1);
    sprite.width = cellSize;

    this.container.addChild(sprite);
  }

  private isEndOfRow(cell: ICell): boolean {
    return cell.x === this.rawMap[cell.y].length - 1;
  }

  private findCellAsset(cell: ICell): string {
    return cell.kind === "wall"
      ? this.findWallType(cell.x, cell.y)
      : this.findFloorType(cell.x, cell.y);
  }

  private getSurroundingWalls(x: number, y: number): SurroundingWallsMap {
    const surroundingWalls: SurroundingWallsMap = {
      top: undefined,
      bottom: undefined,
      left: undefined,
      right: undefined,
      self: undefined,
    };
    this.cells.forEach((cell) => {
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

  private findFloorType(x: number, y: number): string {
    const surroundingWalls = this.getSurroundingWalls(x, y);
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

  private findWallType(x: number, y: number): string {
    const surroundingWalls = this.getSurroundingWalls(x, y);
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
}
