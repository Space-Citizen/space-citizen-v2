import { Application } from "pixi.js";
import { CRTFilter } from "@pixi/filter-crt";
import { Character } from "./entities/character";
import { Map } from "./map/map";
import {
  CRTFilterVignetting,
  cellSize,
  characterStart,
  defaultMapRaw,
} from "../constants";
import { InteractionManager } from "./interactionManager";
import { uiAPI } from "../react-ui/UIApi";
import { Enemy } from "./entities/enemy";

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

  constructor() {
    // create the map
    this.map = new Map(defaultMapRaw);
    app.stage.filterArea = app.screen;
    const crtFilter = new CRTFilter({ vignetting: 1 });
    app.stage.filters = [crtFilter];

    // create an animation to make the vignetting effect
    const interval = setInterval(() => {
      crtFilter.vignetting -= 0.01;
      if (crtFilter.vignetting < CRTFilterVignetting) {
        clearInterval(interval);
        uiAPI.showDialog(
          { message: "Uh.. Where am I?" },
          { dismissTimeout: 2000, animation: "text" }
        );
      }
    }, 80);
  }

  public async init() {
    // init the map
    await this.map.init();
    // create and init the character
    this.character = new Character();
    await this.character.init();
    this.character.x = characterStart.x * cellSize;
    this.character.y = characterStart.y * cellSize;

    // add the character to the map
    this.map.addEntity(this.character);

    // create and init an enemy
    const enemy = new Enemy(this.map, app);
    await enemy.init();
    // offset slightly the enemy to the character start
    enemy.x = (characterStart.x - 3) * cellSize;
    enemy.y = characterStart.y * cellSize;

    // add the character to the map
    this.map.addEntity(enemy);

    const screenCenter = {
      x: app.view.width / 2,
      y: app.view.height / 2,
    };

    // center the map on the character
    this.map.container.x = screenCenter.x - this.character.x;
    this.map.container.y = screenCenter.y - this.character.y;

    // add the map to the stage.
    app.stage.addChild(this.map.container);

    // create the interaction manager
    this.interactionManager = new InteractionManager(
      this.character,
      this.map,
      app
    );
  }

  public destroy() {
    this.interactionManager.destroy();
  }
}
