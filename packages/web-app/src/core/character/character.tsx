import * as PIXI from "pixi.js";
import { createAnimation } from "../sprites/createAnimation";
import type { IEntity } from "../../types";

export async function createCharacter(): Promise<IEntity> {
  const animation = await createAnimation({
    frameSize: { width: 100, height: 149.75 },
    assetPath: "assets/character-sprite.png",
    animationNames: ["walk-down", "walk-up", "walk-left", "walk-right", "idle"],
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

  const character = new PIXI.Container() as IEntity;
  character.zIndex = 1;
  character.speed = 5;
  character.addChild(animation);

  character.walk = (direction) => {
    // if we are already walking in this direction, do nothing
    if (character.walkDirection === direction) {
      return;
    }
    // start by stopping any current walking
    character.stopWalking();
    // update walking direction
    character.walkDirection = direction;
    // change animation to
    animation.switchAnimation(`walk-${direction}`);
  };

  character.stopWalking = () => {
    character.walkDirection = undefined;
    // switch back to the idle animation
    animation.switchAnimation("idle");
  };

  // initialize the character to be standing
  character.stopWalking();
  return character;
}
