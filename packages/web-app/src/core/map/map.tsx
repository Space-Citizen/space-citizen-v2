import { Container } from "pixi.js";
import { cellSize } from "../../constants";
import { ICell } from "../types";
import { parseMap } from "./parsing";

export class Map {
  public container = new Container();
  private readonly cells: ICell[];

  constructor(public readonly rawMap: number[][]) {
    this.cells = parseMap(rawMap);

    this.cells.forEach((cell) => this.container.addChild(cell.asset));

    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
    this.container.sortableChildren = true;
  }

  public isWall(x: number, y: number): boolean {
    const xCell = Math.round(x / cellSize);
    const yCell = Math.ceil(y / cellSize);
    return (
      this.cells.find((c) => c.x === xCell && c.y === yCell)?.solid ?? false
    );
  }
}
