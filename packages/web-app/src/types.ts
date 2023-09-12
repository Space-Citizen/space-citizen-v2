import type { Container } from "pixi.js";

export interface IEntity extends Container {
  walk(direction: Direction): void;
  stopWalking(): void;
  walkDirection: Direction;
  speed: number;
}

export type Direction = "up" | "down" | "left" | "right";

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
