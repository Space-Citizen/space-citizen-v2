import { Container } from "pixi.js";
import { IAnimation, createAnimation } from "../sprites/createAnimation";
import type { Direction, IEntity } from "../../types";

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
      frameSize: { width: 100, height: 149.75 },
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

    this.pivot.x = this.width / 2;
    this.pivot.y = this.height / 2;
    // initialize the character to be standing
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
