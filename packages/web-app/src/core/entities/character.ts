import { Application, Container } from "pixi.js";
import { IAnimation, createAnimation } from "../sprites/createAnimation";
import type { Direction, ICoordinates, IEntity } from "../../types";
import { cellSize, damageCoolDown } from "../../constants";
import { Map } from "../map/map";
import { CellKind, ICell } from "../types";
import { uiAPI } from "../../react-ui/UIApi";
import { random } from "../utils/math";

// Leave some play on the left cells to allow the character to go closer to the walls.
const LeftCellCollisionPlay = 20;

const swearWords = ["Putain !", "Merde !", "Helleveta !", "Bordel !"];

export class Character extends Container implements IEntity {
  private animation: IAnimation<
    ["walk-down", "walk-up", "walk-left", "walk-right", "idle"]
  >;
  public walkDirection: Direction;
  public speed: number;
  public readonly kind = "character";
  private lastDamageTime = 0;
  private isDestroyed = false;

  constructor(
    private map: Map,
    private app: Application
  ) {
    super();
    this.zIndex = 1;
    this.speed = 5;
  }

  public async init() {
    this.animation = await createAnimation({
      frameSize: { width: 100, height: 120 },
      assetPath: "assets/character-sprite.png",
      animationNames: [
        "walk-down",
        "walk-up",
        "walk-left",
        "walk-right",
        "idle",
      ],
      idleAnimationName: "idle",
      animationSettings: {
        "*": {
          animationSpeed: 0.1666,
          loop: true,
          autoPlay: true,
        },
        idle: {
          autoPlay: true,
          animationSpeed: 0.0666,
        },
      },
      scale: "1.4",
    });
    this.addChild(this.animation);
    // offset the animation to center it
    // Since we change the scale of the character, we need to offset the animation,
    // otherwise the character width won't be equal to cellSize
    this.animation.x = (cellSize - this.width) / 2;
    this.stopWalking();

    this.app.ticker.add(this.onTick.bind(this));
  }

  public destroy() {
    super.destroy();
    this.isDestroyed = true;
    this.app.ticker.remove(this.onTick.bind(this));
  }

  private hasHadRecentDamages() {
    if (Date.now() - this.lastDamageTime < damageCoolDown) {
      return true;
    }
    return false;
  }

  public takeDamages() {
    if (this.hasHadRecentDamages()) {
      return;
    }
    this.lastDamageTime = Date.now();
    uiAPI.takeDamage();
    uiAPI.showDialog(
      {
        message: swearWords[random(0, swearWords.length - 1)],
      },
      { dismissTimeout: 1000 }
    );
  }

  private onTick(delta: number) {
    if (this.isDestroyed) {
      return;
    }
    if (this.hasHadRecentDamages()) {
      this.alpha = 0.5;
    } else {
      this.alpha = 1;
    }

    if (!this.walkDirection) {
      return;
    }

    switch (this.walkDirection) {
      case "up":
        this.move(0, this.speed * delta);
        break;
      case "down":
        this.move(0, -this.speed * delta);
        break;
      case "left":
        this.move(this.speed * delta, 0);
        break;
      case "right":
        this.move(-this.speed * delta, 0);
        break;
    }
  }

  // Try to move according to the x and y deltas.
  private move(xDelta: number, yDelta: number) {
    // Calculate the new position for the player.
    // We invert the delta because we are moving the map, not the player
    const newPlayerCoords: ICoordinates = {
      x: this.x + xDelta * -1,
      y: this.y + yDelta * -1,
    };

    if (this.collidesWithWall(newPlayerCoords, xDelta, yDelta)) {
      this.stopWalking();
    } else {
      this.x = newPlayerCoords.x;
      this.y = newPlayerCoords.y;
      // update the zIndex as we move down the map
      this.zIndex = Math.round(newPlayerCoords.y / cellSize);
      this.map.container.y += yDelta;
      this.map.container.x += xDelta;
    }
  }

  private collidesWithWall(
    newPlayerCoords: ICoordinates,
    xDelta: number,
    yDelta: number
  ): boolean {
    // Check if the player is between two cells (on the X axis)
    const isBetweenVerticalCells =
      Math.floor(this.x / cellSize) !==
      Math.floor((this.x + this.width) / cellSize);

    const isBetweenHorizontalCells =
      Math.floor(this.y / cellSize) !==
      Math.floor((this.y + this.height) / cellSize);

    const cellsToCheck: ICoordinates[] = [];
    // if we are going down, we need to check the cells under the player (yDelta is negative)
    if (yDelta < 0) {
      cellsToCheck.push({
        x: Math.floor((newPlayerCoords.x + LeftCellCollisionPlay) / cellSize),
        y: Math.ceil((newPlayerCoords.y - this.height / 2) / cellSize),
      });
      if (isBetweenVerticalCells) {
        cellsToCheck.push({
          x: Math.floor((newPlayerCoords.x + this.width) / cellSize),
          y: Math.ceil((newPlayerCoords.y - this.height / 2) / cellSize),
        });
      }
    }
    // if we are going up, we need to check the cells above the player (yDelta is positive)
    else if (yDelta > 0) {
      cellsToCheck.push({
        x: Math.floor((newPlayerCoords.x + LeftCellCollisionPlay) / cellSize),
        y: Math.ceil((newPlayerCoords.y - this.height / 2) / cellSize),
      });
      if (isBetweenVerticalCells) {
        cellsToCheck.push({
          x: Math.floor((newPlayerCoords.x + this.width) / cellSize),
          y: Math.ceil((newPlayerCoords.y - this.height / 2) / cellSize),
        });
      }
    }
    // if we are going left, we need to check the cells on the left of the player (xDelta is positive)
    else if (xDelta > 0) {
      cellsToCheck.push({
        x: Math.floor((newPlayerCoords.x + LeftCellCollisionPlay) / cellSize),
        y: Math.ceil((newPlayerCoords.y - this.height / 2) / cellSize),
      });
      if (isBetweenHorizontalCells) {
        cellsToCheck.push({
          x: Math.floor((newPlayerCoords.x + LeftCellCollisionPlay) / cellSize),
          y: Math.ceil((newPlayerCoords.y - this.height / 2) / cellSize),
        });
      }
    }
    // if we are going right, we need to check the cells on the right of the player (xDelta is negative)
    else if (xDelta < 0) {
      cellsToCheck.push({
        x: Math.floor((newPlayerCoords.x + this.width) / cellSize),
        y: Math.ceil((newPlayerCoords.y - this.height / 2) / cellSize),
      });
      if (isBetweenHorizontalCells) {
        cellsToCheck.push({
          x: Math.floor((newPlayerCoords.x + this.width) / cellSize),
          y: Math.ceil((newPlayerCoords.y - this.height / 2) / cellSize),
        });
      }
    }

    return cellsToCheck.some((coords) => {
      const cell = this.map.cells.find(
        (cell) => cell.x === coords.x && cell.y === coords.y && cell.solid
      ) as ICell<CellKind.wall>;
      if (!cell) {
        return false;
      }
      // special case if we are going left and the cell is a vertical wall
      if (
        cell.kind === CellKind.wall &&
        // all vertical walls are narrower than a regular cell size
        (cell.properties.wallType.includes("vertical") ||
          // horizontal corner walls are also narrower than a regular cell size
          cell.properties.wallType.includes("right-corner")) &&
        // only vertical-T walls are of regular cell size
        cell.properties.wallType !== "vertical-T"
      ) {
        // The player is allowed to go close to the wall, but not inside it, so we add this 10px margin
        return newPlayerCoords.x < cell.x * cellSize + 10;
      }

      return cell.solid;
    });
  }

  /**
   * Start walking in the given direction
   */
  public walk(direction: Direction): void {
    // if we are already walking in this direction, do nothing
    if (this.walkDirection === direction) {
      return;
    }
    // start by stopping any current walking
    this.stopWalking();
    // update walking direction
    this.walkDirection = direction;
    // change animation to
    this.animation.switchAnimation(`walk-${direction}`);
  }

  /**
   * Stop the walking.
   */
  public stopWalking(): void {
    this.walkDirection = undefined;
    // switch back to the idle animation
    this.animation.switchAnimation("idle");
  }
}
