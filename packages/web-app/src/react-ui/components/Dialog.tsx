import * as React from "react";

import "./Dialog.module.css";

import { IUIComponent } from "../UIApi";

export function Dialog({ content }: IUIComponent): React.ReactElement {
  return (
    <div className="dialog">
      {content.key && <kbd className="dialog-key">{content.key}</kbd>}
      <div className="dialog-content">{content.message}</div>
    </div>
  );
}
