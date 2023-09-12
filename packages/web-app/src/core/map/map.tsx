import { Container } from "pixi.js";
import { cellSize } from "../../constants";
import { ICell } from "../types";
import { parseMap } from "./parsing";

export class Map {
  public container = new Container();
  private cells: ICell[];

  constructor(public readonly rawMap: number[][]) {}

  public async init() {
    this.cells = await parseMap(this.rawMap);
    this.cells.forEach((cell) => this.container.addChild(cell.asset));

    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
    this.container.sortableChildren = true;
  }

  public isWall(x: number, y: number): boolean {
    const cell = this.getCell(x, y);
    return !!cell.solid;
  }

  public getCell(x: number, y: number): ICell | undefined {
    const xCell = Math.round(x / cellSize);
    const yCell = Math.ceil(y / cellSize);
    return this.cells.find((c) => c.x === xCell && c.y === yCell);
  }

  public getCells(x: number, y: number, radius: number): ICell[] {
    const cells = this.cells.filter(
      (c) =>
        c.x >= Math.round((x - radius) / cellSize) &&
        c.x <= Math.round((x + radius) / cellSize) &&
        c.y >= Math.ceil((y - radius) / cellSize) &&
        c.y <= Math.ceil((y + radius) / cellSize)
    );
    return cells;
  }
}
