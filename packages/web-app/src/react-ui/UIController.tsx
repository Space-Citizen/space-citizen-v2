import * as React from "react";
import "./UIController.module.css";
import { EventData, IComponentType, IUIComponent, uiAPI } from "./UIApi";
import { Dialog } from "./components/Dialog";
import { airLeakMaxDuration } from "../constants";

const componentMap: Record<
  IComponentType,
  React.ComponentType<IUIComponent>
> = {
  dialog: Dialog,
};

export function UIController({
  onDeath,
}: {
  onDeath: () => void;
}): React.ReactElement {
  const [canDisplayBars, setCanDisplayBars] = React.useState(false);
  const [activeElements, setActiveElements] = React.useState<IUIComponent[]>(
    []
  );

  const [hp, setHP] = React.useState(100);

  React.useEffect(() => {
    uiAPI.listen((event, data) => {
      switch (event) {
        case "dialog-new":
          setActiveElements((prev) => [
            ...prev,
            data as EventData<"dialog-new">,
          ]);
          break;
        case "dialog-delete":
          setActiveElements((prev) =>
            prev.filter((element) => element.id !== data.id)
          );
          break;
        case "takeDamage":
          setHP((prev) => prev - 10);
          break;
        case "show-bars-ui":
          setCanDisplayBars(true);
          break;
        case "hide-bars-ui":
          setCanDisplayBars(false);
          break;
      }
    });
  }, [uiAPI]);

  React.useEffect(() => {
    if (hp < 0) {
      onDeath();
    }
  }, [hp]);

  return (
    <div className="ui-controller">
      {canDisplayBars && (
        <>
          <div className="ui-hp-container">
            <div>HP</div>
            <div style={{ width: `${hp}%` }} className="ui-hp-bar"></div>
          </div>
          <div className="ui-air-container">
            <div>O2</div>
            <div
              style={{ animationDuration: `${airLeakMaxDuration}ms` }}
              className="ui-air-bar"
            ></div>
          </div>
        </>
      )}
      {activeElements.map((element) => {
        const Component = componentMap[element.type];

        return <Component key={element.id} {...element} />;
      })}
    </div>
  );
}
