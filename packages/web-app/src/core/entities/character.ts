import { Container } from "pixi.js";
import { IAnimation, createAnimation } from "../sprites/createAnimation";
import type { Direction, IEntity } from "../../types";
import { cellSize } from "../../constants";

export class Character extends Container implements IEntity {
  private animation: IAnimation<
    ["walk-down", "walk-up", "walk-left", "walk-right", "idle"]
  >;
  public walkDirection: Direction;
  public speed: number;
  public readonly kind = "character";

  constructor() {
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
