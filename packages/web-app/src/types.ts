import type { Container } from "pixi.js";

export interface IEntity extends Container {
  init(): Promise<void>;
  walk(direction: Direction): void;
  stopWalking(): void;
  walkDirection: Direction;
  speed: number;
  kind: "character" | "enemy";
}

export type Direction = "up" | "down" | "left" | "right";

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export interface ICoordinates {
  x: number;
  y: number;
}
