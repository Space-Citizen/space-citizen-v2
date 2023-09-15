import { Application } from "pixi.js";
import { cellSize, interactionRadius } from "../constants";
import { IEntity } from "../types";
import { Map } from "./map/map";
import { uiAPI } from "../react-ui/UIApi";
import { CellKind, ICell } from "./types";
import { IAnimation } from "./sprites/createAnimation";

/**
 * Class taking care of user interactions,
 * such as movements and interactions with the environment.
 */
export class InteractionManager {
  private pressedKeys = new Set();
  private currentDialog?: {
    key: "start" | "interact" | "repair";
    dismiss: () => void;
  };

  constructor(
    private character: IEntity,
    private map: Map,
    private app: Application
  ) {
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
    this.app.ticker.add(this.onTick.bind(this));

    this.currentDialog = {
      dismiss: uiAPI.showDialog(
        { message: "Oh no ! The air is leaking out." },
        { dismissTimeout: 2000, animation: "text" }
      ),
      key: "start",
    };
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

    const door = cells.find(
      (cell) => cell.kind === CellKind.door
    ) as ICell<CellKind.door>;
    const wall = cells.find(
      (cell) => cell.kind === CellKind.wall && cell.damage > 0
    ) as ICell<CellKind.door>;
    // open or close the door
    if (
      door &&
      // can't close the door if the player is in the way
      !(
        door.x === Math.round(x / cellSize) &&
        // add 20 of play to using the door from quite close
        door.y === Math.round((y + 20) / cellSize) &&
        Math.abs(door.y * cellSize - y) < cellSize / 2
      )
    ) {
      door.properties.toggle();
    } else if (wall) {
      (wall.asset as IAnimation).prevFrame();
      wall.damage--;
    }
  }

  private checkForInteractions = () => {
    const { x, y } = this.character;
    const cells = this.map.getCells(x, y, interactionRadius);

    const canOpenDoor = cells.some((cell) => cell.kind === CellKind.door);
    const canFixWall = cells.some(
      (cell) => cell.kind === CellKind.wall && cell.damage > 0
    );

    // check for doors
    if (canOpenDoor) {
      if (this.currentDialog?.key === "interact") {
        return;
      }
      this.currentDialog?.dismiss();
      this.currentDialog = {
        dismiss: uiAPI.showDialog(
          { key: "E", message: "Interact" },
          { animation: "fade" }
        ),
        key: "interact",
      };
    } else if (canFixWall) {
      if (this.currentDialog?.key === "repair") {
        return;
      }
      this.currentDialog?.dismiss();
      this.currentDialog = {
        dismiss: uiAPI.showDialog(
          { key: "E", message: "Repair" },
          { animation: "fade" }
        ),
        key: "repair",
      };
    } else {
      // except for the start dialog
      if (this.currentDialog?.key === "start") {
        return;
      }
      this.currentDialog?.dismiss();
      this.currentDialog = undefined;
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
