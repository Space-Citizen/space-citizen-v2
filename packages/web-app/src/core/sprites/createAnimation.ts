import {
  AnimatedSprite,
  BaseTexture,
  ISpritesheetData,
  Spritesheet,
  Container,
} from "pixi.js";
import { Writeable } from "../../types";

interface IAnimationSettings
  extends Partial<Pick<AnimatedSprite, "loop" | "animationSpeed">> {
  autoPlay?: boolean;
}

interface ICreateAnimationOptions<
  AN extends readonly string[] = readonly string[],
> {
  readonly frameSize: { width: number; height: number };
  readonly animationNames: AN;
  readonly assetPath: string;
  readonly idleAnimationName: AN[number];
  readonly animationSettings?: Partial<
    Record<AN[number] | "*", IAnimationSettings>
  >;
  readonly scale?: `${number}`;
}

export interface IAnimation<AN extends readonly string[] = string[]>
  extends Container {
  readonly spriteSheet: Spritesheet;
  readonly switchAnimation: (animationName: AN[number]) => void;
  readonly nextFrame: () => void;
  readonly prevFrame: () => void;
  readonly play: () => void;
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
    };
  }
  return frames;
}

export async function createAnimation<const AN extends readonly string[]>({
  frameSize,
  animationNames,
  assetPath,
  idleAnimationName,
  animationSettings,
  scale = "1",
}: ICreateAnimationOptions<AN>): Promise<IAnimation<AN>> {
  const frames = animationNames.map((animationName, vIndex) =>
    createFramesForAnimation(animationName, vIndex, frameSize)
  );
  const spriteData: ISpritesheetData = {
    frames: Object.assign({}, ...frames),
    meta: {
      scale,
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

  const animation = new Container() as unknown as Writeable<IAnimation<AN>>;
  const switchAnimation: IAnimation<AN>["switchAnimation"] = (
    animationName
  ) => {
    animation.children.length > 0 && animation.removeChildAt(0);
    const animatedSprite = new AnimatedSprite(
      spriteSheet.animations[animationName]
    );
    animation.addChild(animatedSprite);
    if (animationSettings) {
      Object.assign(
        animatedSprite,
        animationSettings["*"],
        animationSettings[animationName]
      );
      (animatedSprite as IAnimationSettings)?.autoPlay && animatedSprite.play();
    }
  };

  animation.switchAnimation = switchAnimation;
  animation.spriteSheet = spriteSheet;
  animation.play = () => (animation.children[0] as AnimatedSprite)?.play();
  animation.nextFrame = () => {
    const sprite = animation.children[0] as AnimatedSprite;
    sprite.currentFrame =
      sprite.currentFrame + 1 >= sprite.totalFrames
        ? 0
        : sprite.currentFrame + 1;
  };
  animation.prevFrame = () => {
    const sprite = animation.children[0] as AnimatedSprite;
    sprite.currentFrame =
      sprite.currentFrame - 1 < 0
        ? sprite.totalFrames
        : sprite.currentFrame - 1;
  };
  // start by setting the idle animation
  animation.switchAnimation(idleAnimationName);

  return animation as IAnimation<AN>;
}
