import { Application } from "pixi.js";
import { IEntity } from "../types";
import { createCharacter } from "./character/character";
import { Map } from "./map/map";
import { defaultMapRaw } from "../constants";

export const app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  resizeTo: window,
  backgroundColor: "#404059",
});

export class Controller {
  private readonly pressedKeys = new Set();
  private character: IEntity;
  private map: Map;

  constructor() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    // create the map
    this.map = new Map(defaultMapRaw);
    this.map.container.x = app.view.width / 2;
    this.map.container.y = app.view.height / 2;

    // create the character
    createCharacter().then((character) => {
      this.character = character;
      character.x = this.map.container.width / 2;
      character.y = this.map.container.height / 2;
      character.pivot.x = character.width / 2;
      character.pivot.y = character.height / 2;

      this.map.container.addChild(character);
    });
    app.stage.addChild(this.map.container);
    app.ticker.add(this.renderLoop.bind(this));
  }

  public renderLoop(delta: number): void {
    if (!this.character || !this.character.walkDirection) {
      return;
    }

    const tryToMove = (xDelta: number, yDelta: number) => {
      const newX = this.character.x + xDelta * -1;
      const newY = this.character.y + yDelta * -1;
      if (this.map.isWall(newX, newY)) {
        this.character.stopWalking();
      } else {
        this.character.x = newX;
        this.character.y = newY;
        this.map.container.y += yDelta;
        this.map.container.x += xDelta;
      }
    };

    switch (this.character.walkDirection) {
      case "up":
        tryToMove(0, this.character.speed * delta);
        break;
      case "down":
        tryToMove(0, -this.character.speed * delta);
        break;
      case "left":
        tryToMove(this.character.speed * delta, 0);
        break;
      case "right":
        tryToMove(-this.character.speed * delta, 0);
        break;
    }
  }

  public destroy() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (!event.key.includes("Arrow")) {
      return;
    }
    this.pressedKeys.add(event.key);
    this.updateEntity();
  };

  private onKeyUp = (event: KeyboardEvent) => {
    if (!event.key.includes("Arrow")) {
      return;
    }
    this.pressedKeys.delete(event.key);
    this.updateEntity();
  };

  private updateEntity() {
    const key = this.pressedKeys.values().next().value;
    switch (key) {
      case "ArrowUp":
        this.character.walk("up");
        break;
      case "ArrowDown":
        this.character.walk("down");
        break;
      case "ArrowLeft":
        this.character.walk("left");
        break;
      case "ArrowRight":
        this.character.walk("right");
        break;
      default:
        this.character.stopWalking();
        break;
    }
  }
}
