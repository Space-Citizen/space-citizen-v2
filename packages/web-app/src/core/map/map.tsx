import { Container } from "pixi.js";
import { cellSize } from "../../constants";
import { ICell } from "../types";
import { parseMap } from "./parsing";
import { ICoordinates, IEntity } from "../../types";
import { IRoom, generateMap } from "./generation";

export class Map {
  public container = new Container();
  public cells: ICell[];
  private entities: IEntity[] = [];
  public rawMap: number[][];
  public startLocation: ICoordinates;
  public rooms: IRoom[];

  constructor() {
    const { map, startCoords, rooms } = generateMap();
    this.rooms = rooms;
    this.rawMap = map;
    this.startLocation = startCoords;
  }

  public async init() {
    this.cells = await parseMap(this.rawMap);
    this.cells.forEach((cell) => this.container.addChild(cell.asset));

    this.container.sortableChildren = true;
  }

  public destroy() {
    this.container.destroy();
    this.entities.forEach((entity) => entity.destroy());
  }

  public addEntity(entity: IEntity) {
    this.entities.push(entity);
    this.container.addChild(entity);
  }

  public getEntities(): IEntity[] {
    return this.entities;
  }

  public getCell(x: number, y: number): ICell | undefined {
    const xCell = Math.round(x / cellSize);
    const yCell = Math.round(y / cellSize);

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
