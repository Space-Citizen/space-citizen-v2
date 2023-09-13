import { Application } from "pixi.js";
import { CRTFilter } from "@pixi/filter-crt";
import { IEntity } from "../types";
import { createCharacter } from "./character/character";
import { Map } from "./map/map";
import {
  CRTFilterVignetting,
  cellSize,
  characterStart,
  defaultMapRaw,
} from "../constants";
import { InteractionManager } from "./interactionManager";
import { uiAPI } from "../react-ui/UIApi";

export const app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  resizeTo: window,
  backgroundColor: "#000000",
});

export class GameCore {
  private character: IEntity;
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
    }, 1);
  }

  public async init() {
    // init the map
    await this.map.init();
    this.map.container.x = app.view.width / 2;
    // create and init the character
    this.character = await createCharacter();
    this.character.x = characterStart.x * cellSize + cellSize / 2;
    this.character.y = characterStart.y * cellSize + cellSize / 2;
    this.character.pivot.x = this.character.width / 2;
    this.character.pivot.y = this.character.height / 2;

    this.map.container.y =
      app.view.height / 2 + this.map.container.height / 2 - this.character.y;
    // add the character to the map
    this.map.container.addChild(this.character);
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
