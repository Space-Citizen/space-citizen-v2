import * as PIXI from "pixi.js";
import { cellSize } from "../../constants";
import { ICell } from "../types";
import { parseMap } from "./parsing";

export class Map {
  public container = new PIXI.Container();
  private readonly cells: ICell[];

  constructor(public readonly rawMap: number[][]) {
    this.cells = parseMap(rawMap);

    this.cells.forEach(this.addMapElement.bind(this));

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
    const cellAbove = this.cells.find(
      (c) => c.x === cell.x && c.y === cell.y - 1
    );

    switch (cell.kind) {
      case "floor":
        sprite = PIXI.Sprite.from(`assets/${cell.assetName}.png`);
        sprite.zIndex = 0;
        break;
      case "wall":
        sprite = PIXI.Sprite.from(`assets/${cell.assetName}.png`);
        sprite.zIndex = cell.y;
        // for walls, always add a floor tile underneath
        !this.isEndOfRow(cell) &&
          this.addMapElement({
            ...cell,
            kind: "floor",
            assetName:
              // if the cell above is an horizontal wall or a vertical-t-right, add a corner shadow
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
}
