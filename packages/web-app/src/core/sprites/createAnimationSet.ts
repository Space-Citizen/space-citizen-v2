import {
  AnimatedSprite,
  BaseTexture,
  ISpritesheetData,
  Spritesheet,
} from "pixi.js";

interface ICreateAnimationOptions<
  AN extends readonly string[] = readonly string[]
> {
  readonly frameSize: { width: number; height: number };
  readonly animationNames: AN;
  readonly assetPath: string;
  readonly idleAnimationName: AN[number];
  readonly animationSettings?: Partial<Record<AN[number] | "*", Partial<Pick<AnimatedSprite, "loop" | "animationSpeed">>>>;
}

interface IAnimationSet<AN extends readonly string[]> {
  readonly animation: AnimatedSprite;
  readonly spriteSheet: Spritesheet;
  readonly switchAnimation: (animationName: AN[number]) => void;
}

function createFramesForAnimation(
  animationName: string,
  vIndex: number,
  frameSize: ICreateAnimationOptions["frameSize"]
): ISpritesheetData["frames"] {
  const frames: ISpritesheetData["frames"] = {};

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

export async function createAnimationSet<const AN extends readonly string[]>({
  frameSize,
  animationNames,
  assetPath,
  idleAnimationName,
  animationSettings
}: ICreateAnimationOptions<AN>): Promise<IAnimationSet<AN>> {
  const frames = animationNames.map((animationName, vIndex) =>
    createFramesForAnimation(animationName, vIndex, frameSize)
  );
  const spriteData: ISpritesheetData = {
    frames: Object.assign({}, ...frames),
    meta: {
      scale: "1",
    },
    animations: frames.reduce<ISpritesheetData["animations"]>(
      (acc, animationFrames, i) => {
        acc[animationNames[i]] = Object.keys(animationFrames);
        return acc;
      },
      {}
    ),
  };

  // Create the SpriteSheet from data and image
  const spriteSheet = new Spritesheet(BaseTexture.from(assetPath), spriteData);

  // Generate all the Textures asynchronously
  await spriteSheet.parse();

  const animationSet: IAnimationSet<AN> = {
    switchAnimation: (animationName) => {
      (animationSet.animation as AnimatedSprite) = new AnimatedSprite(
        spriteSheet.animations[animationName]
      );
      if (animationSettings) {
        Object.assign(animationSet.animation, animationSettings["*"], animationSettings[animationName]);
      }
      animationSet.animation.play();
    },
    spriteSheet,
    // start by setting the idle animation
    animation: new AnimatedSprite(spriteSheet.animations[idleAnimationName]),
  };

  return animationSet;
}
