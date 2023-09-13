import { Container } from "pixi.js";
import { cellSize } from "../../constants";
import { ICell } from "../types";
import { parseMap } from "./parsing";
import { IEntity } from "../../types";

export class Map {
  public container = new Container();
  public cells: ICell[];
  private entities: IEntity[] = [];

  constructor(public readonly rawMap: number[][]) {}

  public async init() {
    this.cells = await parseMap(this.rawMap);
    this.cells.forEach((cell) => this.container.addChild(cell.asset));

    this.container.sortableChildren = true;
  }

  public addEntity(entity: IEntity) {
    this.entities.push(entity);
    this.container.addChild(entity);
  }

  public getEntities(): IEntity[] {
    return this.entities;
  }

  public isWall(x: number, y: number): boolean {
    const cell = this.getCell(x, y) as ICell<"wall">;
    if (!cell) {
      return false;
    }

    // vertical walls to the left of the player needs to be checked differently.
    // Since they have a width lower that the cell size, we need to check if the player is
    // close enough to the wall to be considered colliding with it.
    if (
      cell.kind === "wall" &&
      x > cell.x * cellSize &&
      ((cell.properties.wallType.includes("vertical") &&
        cell.properties.wallType !== "vertical-T") ||
        cell.properties.wallType.includes("right-corner"))
    ) {
      return Math.abs(cell.x * cellSize - x) < 0;
    }
    return !!cell.solid;
  }

  public getCell(
    x: number,
    y: number,
    xRoundingMethod: "round" | "floor" | "ceil" = "round",
    yRoundingMethod: "round" | "floor" | "ceil" = "round"
  ): ICell | undefined {
    const xCell = Math[xRoundingMethod](x / cellSize);
    const yCell = Math[yRoundingMethod](y / cellSize);

    return this.cells.find((c) => c.x === xCell && c.y === yCell);
  }

  public getCells(x: number, y: number, radius: number): ICell[] {
    const cells = this.cells.filter(
      (c) =>
        c.x >= Math.round((x - radius) / cellSize) &&
        c.x <= Math.round((x + radius) / cellSize) &&
        c.y >= Math.round((y - radius) / cellSize) &&
        c.y <= Math.round((y + radius) / cellSize)
    );
    return cells;
  }
}
