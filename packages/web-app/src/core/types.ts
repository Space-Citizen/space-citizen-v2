import { Container, Sprite } from "pixi.js";

export enum CellKind {
  floor,
  wall,
  door,
}

export type FloorType =
  | "floor"
  | "floor-shadow-left"
  | "floor-shadow-corner"
  | "floor-shadow-top-left"
  | "floor-shadow-top";

export type WallType =
  | "pillar"
  | "vertical"
  | "vertical-top"
  | "vertical-bottom"
  | "vertical-T"
  | "horizontal"
  | "horizontal-window-left"
  | "horizontal-window-right"
  | "horizontal-T"
  | "horizontal-left-corner-bottom"
  | "horizontal-right-corner-bottom"
  | "horizontal-left-corner-top"
  | "horizontal-right-corner-top"
  | "horizontal-left"
  | "horizontal-right";

type CellProperties<K extends CellKind> = K extends CellKind.floor
  ? {
      floorType: FloorType;
    }
  : K extends CellKind.wall
  ? {
      wallType: WallType;
      windowType?: "left" | "right";
    }
  : K extends CellKind.door
  ? {
      toggle: () => void;
      open: boolean;
    }
  : never;

export interface ICell<K extends CellKind = CellKind> {
  kind: K;
  asset: Sprite | Container;
  x: number;
  y: number;
  // If true, the cell is not walkable.
  solid: boolean;
  properties: CellProperties<K>;
  damage: number;
}
