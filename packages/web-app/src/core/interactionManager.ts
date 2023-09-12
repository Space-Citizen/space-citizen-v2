import { Application } from "pixi.js";
import { cellSize, interactionRadius } from "../constants";
import { IEntity } from "../types";
import { Map } from "./map/map";
import { uiAPI } from "../react-ui/UIApi";
import { IAnimation } from "./sprites/createAnimation";
import { ICell } from "./types";

export class InteractionManager {
  private pressedKeys = new Set();
  private dialogDismiss: () => void;

  constructor(
    private character: IEntity,
    private map: Map,
    private app: Application
  ) {
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
    this.app.ticker.add(this.renderLoop.bind(this));
  }

  public destroy() {
    this.app.ticker.remove(this.renderLoop.bind(this));
  }

  public renderLoop(delta: number): void {
    this.moveCharacter(delta);

    this.checkForInteractions();
  }

  private moveCharacter(delta: number) {
    if (!this.character || !this.character.walkDirection) {
      return;
    }

    const tryToMove = (xDelta: number, yDelta: number) => {
      const newX = this.character.x + xDelta * -1;
      const newY = this.character.y + yDelta * -1;
      // Extra margin to the right side to avoid getting stuck on the wall
      const rightSideExtraMargin = 30;
      if (
        this.map.isWall(
          newX + this.character.width / 2 - rightSideExtraMargin,
          newY
        ) ||
        this.map.isWall(newX - this.character.width / 2, newY)
      ) {
        this.character.stopWalking();
      } else {
        this.character.x = newX;
        this.character.y = newY;
        // update the zIndex as we move down the map
        this.character.zIndex = Math.ceil(newY / cellSize);
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

  private checkKeysPressed() {
    const key = this.pressedKeys.values().next().value;
    switch (key) {
      case "e":
        this.interact();
        break;
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

  private interact() {
    const { x, y } = this.character;
    const cells = this.map.getCells(x, y, interactionRadius);

    const door = cells.find((cell) => cell.kind === "door") as ICell<"door">;
    // open or close the door
    if (door) {
      if (!door.properties.open) {
        door.properties.open = true;
        door.solid = false;
        (door.asset as IAnimation).switchAnimation("open");
        (door.asset as IAnimation).play();
      } else if (
        door.properties.open &&
        // check if the character is in the door
        (Math.abs(door.y * cellSize - y) < 25 ||
          Math.abs(door.y * cellSize - y) > 100)
      ) {
        door.properties.open = false;
        door.solid = true;
        (door.asset as IAnimation).switchAnimation("close");
        (door.asset as IAnimation).play();
      }
    }
  }

  private checkForInteractions = () => {
    const { x, y } = this.character;
    const cells = this.map.getCells(x, y, interactionRadius);

    // check for doors
    const hasInteractable = cells.some((cell) => cell.kind === "door");
    if (hasInteractable && !this.dialogDismiss) {
      this.dialogDismiss?.();
      this.dialogDismiss = uiAPI.showDialog(
        { key: "E", message: "Interact" },
        { animation: "fade" }
      );
    } else if (!hasInteractable) {
      this.dialogDismiss?.();
      this.dialogDismiss = undefined;
    }
  };

  private onKeyDown(event: KeyboardEvent) {
    this.pressedKeys.add(event.key);
    this.checkKeysPressed();
  }

  private onKeyUp(event: KeyboardEvent) {
    this.pressedKeys.delete(event.key);
    this.checkKeysPressed();
  }
}
