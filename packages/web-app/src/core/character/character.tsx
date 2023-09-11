import * as PIXI from "pixi.js";
import { app } from "../pixi";

type Direction = "up" | "down" | "left" | "right";

interface ICharacter extends PIXI.Container {
  walk(direction: Direction): void;
  stop(): void;
}

const frameSize = { width: 100, height: 149.75 };

function createFramesForAnimation(
  animationName: string,
  vIndex: number
): PIXI.ISpritesheetData["frames"] {
  const frames: PIXI.ISpritesheetData["frames"] = {};

  for (let i = 0; i < 4; i++) {
    frames[`${animationName}${i}`] = {
      frame: {
        x: i * frameSize.width,
        y: vIndex * frameSize.height,
        w: frameSize.width,
        h: frameSize.height,
      },
      sourceSize: { w: frameSize.width, h: frameSize.height },
      spriteSourceSize: { x: 0, y: 0 },
    };
  }
  return frames;
}

export async function createCharacter(): Promise<ICharacter> {
  const walkDownFrames = createFramesForAnimation("walk-down", 0);
  const walkUpFrames = createFramesForAnimation("walk-up", 1);
  const walkLeftFrames = createFramesForAnimation("walk-left", 2);
  const walkRightFrames = createFramesForAnimation("walk-right", 3);
  // Create object to store sprite sheet data
  const characterSpriteData: PIXI.ISpritesheetData = {
    frames: {
      ...walkDownFrames,
      ...walkUpFrames,
      ...walkLeftFrames,
      ...walkRightFrames,
    },
    meta: {
      scale: "1",
    },
    animations: {
      "walk-down": Object.keys(walkDownFrames),
      "walk-up": Object.keys(walkUpFrames),
      "walk-left": Object.keys(walkLeftFrames),
      "walk-right": Object.keys(walkRightFrames),
    },
  };

  // Create the SpriteSheet from data and image
  const spriteSheet = new PIXI.Spritesheet(
    PIXI.BaseTexture.from("assets/character-sprite.png"),
    characterSpriteData
  );

  // Generate all the Textures asynchronously
  await spriteSheet.parse();

  const character = new PIXI.Container() as ICharacter;
  const standingFrame = new PIXI.Sprite(spriteSheet.textures["walk-down0"]);

  let currentWalkingDir: Direction;

  let onTick: PIXI.TickerCallback<unknown>;

  character.addChild(standingFrame);

  character.walk = (direction) => {
    if (currentWalkingDir === direction) {
      return;
    }
    character.stop();
    currentWalkingDir = direction;
    const animation = new PIXI.AnimatedSprite(
      spriteSheet.animations[`walk-${direction}`]
    );
    character.removeChildAt(0);
    character.addChild(animation);
    animation.animationSpeed = 0.1666;
    animation.loop = true;
    animation.play();

    onTick = (delta: number) => {
      const speed = 5;
      const amount = speed * delta;
      switch (direction) {
        case "up":
          character.y -= amount;
          break;
        case "down":
          character.y += amount;
          break;
        case "left":
          character.x -= amount;
          break;
        case "right":
          character.x += amount;
          break;
      }
    };

    app.ticker.add(onTick);
  };

  character.stop = () => {
    if (!currentWalkingDir) {
      return;
    }
    currentWalkingDir = undefined;
    app.ticker.remove(onTick);
    character.removeChildAt(0);
    character.addChild(standingFrame);
  };
  return character;
}
