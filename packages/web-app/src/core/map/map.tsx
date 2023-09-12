import * as PIXI from "pixi.js";
import { cellSize } from "../../constants";

type CellKind = "floor" | "wall";

type SurroundingWallsMap = Record<
  "top" | "bottom" | "left" | "right" | "self",
  undefined | ICell
>;

export interface ICell<K extends CellKind = CellKind> {
  readonly kind: K;
  readonly wallDirection?: "horizontal" | "vertical";
  readonly x: number;
  readonly y: number;
}

export class Map {
  public container = new PIXI.Container();
  private readonly cells: ICell[];

  constructor(public readonly rawMap: number[][]) {
    this.cells = rawMap.reduce<ICell[]>((map, row, y) => {
      row.forEach((cell, x) => {
        map.push({
          kind: cell === 1 ? "wall" : "floor",
          wallDirection:
            (x > 0 && row[x - 1] === 1) ||
            (x + 1 < row.length && row[x + 1] === 1)
              ? "horizontal"
              : "vertical",
          x,
          y,
        });
      });
      return map;
    }, []);

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
    const surroundingWalls = this.getSurroundingWalls(cell);

    switch (cell.kind) {
      case "floor":
        sprite = PIXI.Sprite.from(
          `assets/${this.findFloorType(surroundingWalls)}.png`
        );
        sprite.zIndex = 0;
        break;
      case "wall":
        sprite = PIXI.Sprite.from(
          `assets/${this.findWallType(surroundingWalls)}.png`
        );
        sprite.zIndex = cell.y;
        // for walls, always add a floor tile underneath
        !this.isEndOfRow(cell) &&
          this.addMapElement({ ...cell, kind: "floor" });
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

  private getSurroundingWalls({ x, y }: ICell): SurroundingWallsMap {
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

  private findFloorType(surroundingWalls: SurroundingWallsMap): string {
    if (
      surroundingWalls.self &&
      surroundingWalls.top?.wallDirection === "horizontal"
    ) {
      return "floor-shadow-both";
    }
    if (surroundingWalls.self) {
      return "floor-shadow-left";
    }
    if (surroundingWalls.top?.wallDirection === "horizontal") {
      return "floor-shadow-top";
    }
    return "floor";
  }

  private findWallType(surroundingWalls: SurroundingWallsMap): string {
    // if there is a wall to the left or right, it's a horizontal wall
    if (surroundingWalls.left && surroundingWalls.right) {
      if (surroundingWalls.bottom) {
        return "wall-horizontal-T";
      }
      return "wall-horizontal";
    }
    if (surroundingWalls.top && surroundingWalls.bottom) {
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
