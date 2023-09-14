import { Application, Container } from "pixi.js";
import { Direction, ICoordinates, IEntity } from "../../types";
import { Map } from "../map/map";
import { IAnimation, createAnimation } from "../sprites/createAnimation";
import { distance } from "../../utils/distance";
import { findPath } from "../../utils/pathFinding";
import { cellSize } from "../../constants";

/**
 * Base class for all enemies.
 */
export class Enemy extends Container implements IEntity {
  private animation: IAnimation<
    ["walk-down", "walk-up", "walk-left", "walk-right", "idle"]
  >;
  private detectionRange = 200;
  private hitRange = 20;
  public path: ICoordinates[] | undefined;
  public walkDirection: Direction | undefined;
  public speed: number;
  public readonly kind = "enemy";

  constructor(
    private map: Map,
    private app: Application
  ) {
    super();
    this.speed = 1;
    this.app.ticker.add(this.onTick.bind(this));
  }

  public async init(): Promise<void> {
    this.animation = await createAnimation({
      frameSize: { width: 100, height: 100 },
      assetPath: "assets/enemy-sprite.png",
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
      scale: "1",
    });
    this.addChild(this.animation);
    // offset the animation to center it
    // Since we change the scale of the character, we need to offset the animation,
    // otherwise the character width won't be equal to cellSize
    this.animation.x = (cellSize - this.width) / 2;

    // initialize the character to be standing
    this.stopWalking();
  }

  public destroy(): void {
    super.destroy();
    this.app.ticker.remove(this.onTick.bind(this));
  }

  public onTick(): void {
    // if there is path to visit, start walking
    if (this.path?.length > 0) {
      this.walkOnPath();
      return;
    }

    for (const entity of this.map.getEntities()) {
      // close enough to do damage
      const distanceToEntity = distance(this.x, this.y, entity.x, entity.y);
      if (entity.kind === "character" && distanceToEntity < this.hitRange) {
        console.log("hit");
      }
      // close enough to start following
      else if (
        entity.kind === "character" &&
        distanceToEntity < this.detectionRange
      ) {
        const myCell = this.map.getCell(this.x - 1, this.y - 1);
        this.path = findPath(myCell, entity, this.map);
        return;
      }
    }
  }

  private walkOnPath() {
    const currentPath = this.path[0];
    const targetX = currentPath.x * cellSize;
    const targetY = currentPath.y * cellSize;
    const xDelta = targetX - this.x;
    const yDelta = targetY - this.y;
    const distanceToTarget = distance(this.x, this.y, targetX, targetY);
    // Check which direction we are moving the most
    if (Math.abs(xDelta) > Math.abs(yDelta)) {
      xDelta > 0 ? this.walk("right") : this.walk("left");
    } else {
      yDelta > 0 ? this.walk("down") : this.walk("up");
    }

    if (distanceToTarget < this.hitRange) {
      this.x = targetX;
      this.y = targetY;
      this.path.shift();
      this.stopWalking();
    } else {
      this.x += (xDelta / distanceToTarget) * this.speed;
      this.y += (yDelta / distanceToTarget) * this.speed;
    }
  }

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

  public stopWalking(): void {
    this.walkDirection = undefined;
    // switch back to the idle animation
    this.animation.switchAnimation("idle");
  }
}
