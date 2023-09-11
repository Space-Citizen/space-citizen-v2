import * as PIXI from "pixi.js";
import { createAnimationSet } from "../sprites/createAnimationSet";
import type { IEntity } from "../../types";

export async function createCharacter(): Promise<IEntity> {
  const animationSet = await createAnimationSet({
    frameSize: { width: 100, height: 149.75 },
    assetPath: "assets/character-sprite.png",
    animationNames: ["walk-down", "walk-up", "walk-left", "walk-right", "idle"],
    idleAnimationName: "idle",
    animationSettings: {
      "*": {
        animationSpeed: 0.1666,
        loop: true,
      },
      idle: {
        animationSpeed: 0.0666,
      },
    },
  });

  const character = new PIXI.Container() as IEntity;
  character.zIndex = 1;
  character.speed = 5;

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
    animationSet.switchAnimation(`walk-${direction}`);
    character.removeChildAt(0);
    character.addChild(animationSet.animation);
  };

  character.stopWalking = () => {
    character.walkDirection = undefined;
    character.children.length > 0 && character.removeChildAt(0);
    // switch back to the idle animation
    animationSet.switchAnimation("idle");
    character.addChild(animationSet.animation);
  };

  // initialize the character to be standing
  character.stopWalking();
  return character;
}
