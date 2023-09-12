import * as React from "react";
import "./UIController.module.css";
import { EventData, IComponentType, IUIComponent, uiAPI } from "./UIApi";
import { Dialog } from "./components/Dialog";

const componentMap: Record<
  IComponentType,
  React.ComponentType<IUIComponent>
> = {
  dialog: Dialog,
};

export function UIController(): React.ReactElement {
  const [activeElements, setActiveElements] = React.useState<IUIComponent[]>(
    []
  );

  React.useEffect(() => {
    uiAPI.listen((event, data) => {
      switch (event) {
        case "new":
          setActiveElements((prev) => [...prev, data as EventData<"new">]);
          break;
        case "delete":
          setActiveElements((prev) =>
            prev.filter((element) => element.id !== data.id)
          );
      }
    });
  }, [uiAPI]);

  return (
    <div className="ui-controller">
      {activeElements.map((element) => {
        const Component = componentMap[element.type];

        return <Component key={element.id} {...element} />;
      })}
    </div>
  );
}
