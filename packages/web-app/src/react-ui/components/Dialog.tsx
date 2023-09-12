import * as React from "react";

import "./Dialog.module.css";

import { IUIComponent } from "../UIApi";

export function Dialog({ content, options }: IUIComponent): React.ReactElement {
  return (
    <div
      className={`dialog ${
        options?.animation === "fade" ? "dialog-animation-fade" : ""
      }`}
    >
      {content.key && <kbd className="dialog-key">{content.key}</kbd>}
      <div
        className={`dialog-content ${
          options?.animation === "text" ? "dialog-animation-text" : ""
        }`}
      >
        {content.message}
      </div>
    </div>
  );
}
