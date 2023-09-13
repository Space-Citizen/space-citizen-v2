import { Application } from "pixi.js";
import { cellSize, interactionRadius } from "../constants";
import { ICoordinates, IEntity } from "../types";
import { Map } from "./map/map";
import { uiAPI } from "../react-ui/UIApi";
import { IAnimation } from "./sprites/createAnimation";
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

  public onTick(delta: number): void {
    this.moveCharacter(delta);

    this.checkForInteractions();
  }

  private moveCharacter(delta: number) {
    if (!this.character || !this.character.walkDirection) {
      return;
    }

    const tryToMove = (xDelta: number, yDelta: number) => {
      // Calculate the new position for the player.
      // We invert the delta because we are moving the map, not the player
      const newPlayerX = this.character.x + xDelta * -1;
      const newPlayerY = this.character.y + yDelta * -1;

      // Check if the player is between two cells (on the X axis)
      const isBetweenVerticalCells =
        Math.floor(this.character.x / cellSize) !==
        Math.floor((this.character.x + this.character.width) / cellSize);

      const isBetweenHorizontalCells =
        Math.floor(this.character.y / cellSize) !==
        Math.floor((this.character.y + this.character.height) / cellSize);

      const cellsToCheck: ICoordinates[] = [];
      // if we are going down, we need to check the cells under the player (yDelta is negative)
      if (yDelta < 0) {
        cellsToCheck.push({
          x: Math.floor(newPlayerX / cellSize),
          y: Math.floor((newPlayerY + this.character.height) / cellSize),
        });
        if (isBetweenVerticalCells) {
          cellsToCheck.push({
            x: Math.floor((newPlayerX + this.character.width) / cellSize),
            y: Math.floor((newPlayerY + this.character.height) / cellSize),
          });
        }
      }
      // if we are going up, we need to check the cells above the player (yDelta is positive)
      else if (yDelta > 0) {
        cellsToCheck.push({
          x: Math.floor(newPlayerX / cellSize),
          y: Math.floor(newPlayerY / cellSize),
        });
        if (isBetweenVerticalCells) {
          cellsToCheck.push({
            x: Math.floor((newPlayerX + this.character.width) / cellSize),
            y: Math.floor(newPlayerY / cellSize),
          });
        }
      }
      // if we are going left, we need to check the cells on the left of the player (xDelta is positive)
      else if (xDelta > 0) {
        cellsToCheck.push({
          x: Math.floor(newPlayerX / cellSize),
          y: Math.floor(newPlayerY / cellSize),
        });
        if (isBetweenHorizontalCells) {
          cellsToCheck.push({
            x: Math.floor(newPlayerX / cellSize),
            y: Math.floor((newPlayerY + this.character.height) / cellSize),
          });
        }
      }
      // if we are going right, we need to check the cells on the right of the player (xDelta is negative)
      else if (xDelta < 0) {
        cellsToCheck.push({
          x: Math.floor((newPlayerX + this.character.width) / cellSize),
          y: Math.floor(newPlayerY / cellSize),
        });
        if (isBetweenHorizontalCells) {
          cellsToCheck.push({
            x: Math.floor((newPlayerX + this.character.width) / cellSize),
            y: Math.floor((newPlayerY + this.character.height) / cellSize),
          });
        }
      }

      const hasSolidCell = cellsToCheck.some((coords) => {
        const cell = this.map.cells.find(
          (cell) => cell.x === coords.x && cell.y === coords.y && cell.solid
        );
        // special case if we are going left and the cell is a vertical wall
        if (
          cell &&
          cell.kind === "wall" &&
          (cell as ICell<"wall">).properties.wallType.includes("vertical")
        ) {
          return newPlayerX < cell.x * cellSize + 28;
        }
        return cell?.solid;
      });

      if (hasSolidCell) {
        this.character.stopWalking();
      } else {
        this.character.x = newPlayerX;
        this.character.y = newPlayerY;
        // update the zIndex as we move down the map
        this.character.zIndex = Math.ceil(newPlayerY / cellSize);
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
