import { Application } from "pixi.js";
import { CRTFilter } from "@pixi/filter-crt";
import { IEntity } from "../types";
import { createCharacter } from "./character/character";
import { Map } from "./map/map";
import { cellSize, characterStart, defaultMapRaw } from "../constants";
import { uiAPI } from "../react-ui/UIApi";
import { InteractionManager } from "./interactionManager";

export const app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  resizeTo: window,
  backgroundColor: "#000000",
});

export class Controller {
  private character: IEntity;
  private map: Map;
  private interactionManager: InteractionManager;

  constructor() {
    // create the map
    this.map = new Map(defaultMapRaw);
    app.stage.filterArea = app.screen;
    app.stage.filters = [new CRTFilter({ vignetting: 0.67 })];
  }

  public async init() {
    // init the map
    this.map.init();
    this.map.container.x = app.view.width / 2;
    // create and init the character
    this.character = await createCharacter();
    this.character.x = characterStart.x * cellSize;
    this.character.y = characterStart.y * cellSize;
    this.character.pivot.x = 0;
    this.character.pivot.y = this.character.height / 2;

    this.map.container.y =
      app.view.height / 2 + characterStart.y * cellSize + this.character.height;
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

    uiAPI.showDialog(
      { message: "What is going on ..?" },
      { dismissTimeout: 3000, animation: "text" }
    );
  }

  public destroy() {
    this.interactionManager.destroy();
  }
}
