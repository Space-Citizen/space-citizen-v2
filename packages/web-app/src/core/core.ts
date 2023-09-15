import { Application } from "pixi.js";
import { CRTFilter } from "@pixi/filter-crt";
import { Character } from "./entities/character";
import { Map } from "./map/map";
import { CRTFilterVignetting, cellSize } from "../constants";
import { InteractionManager } from "./interactionManager";
import { uiAPI } from "../react-ui/UIApi";
import { Enemy } from "./entities/enemy";
import { random } from "./utils/math";
import { sleep } from "./utils/sleep";

export const app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  resizeTo: window,
  backgroundColor: "#000000",
});

export class GameCore {
  private character: Character;
  private map: Map;
  private interactionManager: InteractionManager;
  private crtFilter: CRTFilter;

  constructor() {
    // create the map
    this.map = new Map();
    app.stage.filterArea = app.screen;
    this.crtFilter = new CRTFilter({ vignetting: 1 });
    app.stage.filters = [this.crtFilter];
  }
  private async CRTAnimation(
    direction: "forward" | "backwards",
    duration: number
  ) {
    // create an animation to make the vignetting effect
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        this.crtFilter.vignetting =
          direction === "forward"
            ? this.crtFilter.vignetting - 0.01
            : this.crtFilter.vignetting + 0.01;
        if (
          direction === "forward"
            ? this.crtFilter.vignetting < CRTFilterVignetting
            : this.crtFilter.vignetting >= 1
        ) {
          clearInterval(interval);
          resolve();
        }
      }, duration / 60 /* 60fps */);
    });
  }

  private async playStartAnimation() {
    const wakeUpDuration = 2000;

    let dismiss = uiAPI.showDialog(
      { message: "*CRASH*" },
      { animation: "text" }
    );

    await sleep(2000);
    dismiss();
    dismiss = uiAPI.showDialog(
      { message: "What was that ??" },
      { animation: "text" }
    );
    +(await sleep(1000));
    // a animation to make the vignetting effect
    await this.CRTAnimation("forward", wakeUpDuration);
    dismiss();
    // reverse the animation
    return this.CRTAnimation("backwards", wakeUpDuration);
  }

  public async init() {
    const screenCenter = {
      x: app.view.width / 2,
      y: app.view.height / 2,
    };

    // create and init the character
    this.character = new Character(this.map, app);
    await this.character.init();
    this.character.x = screenCenter.x;
    this.character.y = screenCenter.y;
    // add temporarily the character to the stage to play the start animation
    app.stage.addChild(this.character);
    await this.playStartAnimation();
    app.stage.removeChild(this.character);
    // init the map
    await this.map.init();
    this.character.x = this.map.startLocation.x * cellSize;
    this.character.y = this.map.startLocation.y * cellSize;

    // add the character to the map
    this.map.addEntity(this.character);

    // generate all enemies, 0 to 2 per room, except for the start room
    this.map.rooms.slice(/* skip start room */ 1).forEach(async (room) => {
      const enemiesToGenerate = random(0, 2);
      for (let i = 0; i < enemiesToGenerate; i++) {
        // create and init an enemy
        const enemy = new Enemy(
          this.map,
          app,
          /* speed */ 2,
          /* detectionRange */ 300
        );
        await enemy.init();
        enemy.x = (room.actualCenter.x + i) * cellSize;
        enemy.y = room.actualCenter.y * cellSize;

        // add the character to the map
        this.map.addEntity(enemy);
      }
    });

    // center the map on the character
    this.map.container.x = screenCenter.x - this.character.x;
    this.map.container.y = screenCenter.y - this.character.y;

    // add the map to the stage.
    app.stage.addChild(this.map.container);
    // increase size of CRT effect
    await this.CRTAnimation("forward", 2000);

    // create the interaction manager
    this.interactionManager = new InteractionManager(
      this.character,
      this.map,
      app
    );
  }

  public destroy() {
    this.interactionManager.destroy();
    this.map.destroy();
  }
}
