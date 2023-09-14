import { Application } from "pixi.js";
import { interactionRadius } from "../constants";
import { IEntity } from "../types";
import { Map } from "./map/map";
import { uiAPI } from "../react-ui/UIApi";
import { ICell } from "./types";

/**
 * Class taking care of user interactions,
 * such as movements and interactions with the environment.
 */
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
    this.app.ticker.add(this.onTick.bind(this));
  }

  public destroy() {
    this.app.ticker.remove(this.onTick.bind(this));
  }

  public onTick(): void {
    this.checkForInteractions();
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
      door.properties.toggle();
    }
  }

  private checkForInteractions = () => {
    const { x, y } = this.character;
    const cells = this.map.getCells(x, y, interactionRadius);

    // check for doors
    const hasInteraction = cells.some((cell) => cell.kind === "door");
    if (hasInteraction && !this.dialogDismiss) {
      this.dialogDismiss?.();
      this.dialogDismiss = uiAPI.showDialog(
        { key: "E", message: "Interact" },
        { animation: "fade" }
      );
    } else if (!hasInteraction) {
      this.dialogDismiss?.();
      this.dialogDismiss = undefined;
    }
  };

  private onKeyDown(event: KeyboardEvent) {
    if (!event.key.includes("Arrow") && event.key !== "e") {
      return;
    }
    this.pressedKeys.add(event.key);
    this.checkKeysPressed();
  }

  private onKeyUp(event: KeyboardEvent) {
    this.pressedKeys.delete(event.key);
    this.checkKeysPressed();
  }
}
