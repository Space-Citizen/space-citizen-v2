export type IComponentType = "dialog";

export interface IUIComponent {
  id: string;
  content: {
    message: string;
    key?: string;
  };
  type: IComponentType;
  options?: IShowDialogOptions;
}

export type Event =
  | "dialog-new"
  | "dialog-delete"
  | "takeDamage"
  | "hide-bars-ui"
  | "show-bars-ui";

export type EventData<E extends Event> = E extends "dialog-new"
  ? IUIComponent
  : E extends "dialog-delete"
  ? { id: string }
  : undefined;

export interface IShowDialogOptions {
  dismissTimeout?: number;
  animation?: "fade" | "text";
}

export type EventCallback<E extends Event = Event> = (
  event: E,
  data: EventData<E>
) => void;

class UIApi {
  private listener: EventCallback;
  private eventCounter = 0;

  public listen(callback: EventCallback) {
    this.listener = callback;
  }

  /**
   * Displays a dialog with the given message.
   *
   * @returns A function that can be called to close the dialog.
   */
  public showDialog(
    content: IUIComponent["content"],
    options?: IShowDialogOptions
  ): () => void {
    const id = (this.eventCounter++).toString();
    this.listener?.("dialog-new", {
      id,
      type: "dialog",
      content,
      options,
    });

    const dismiss = () => this.closeDialog(id);

    if (options?.dismissTimeout) {
      setTimeout(dismiss, options.dismissTimeout);
    }

    return dismiss;
  }

  public takeDamage() {
    this.listener?.("takeDamage", undefined);
  }

  public showUI() {
    this.listener?.("show-bars-ui", undefined);
  }
  public hideUI() {
    this.listener?.("hide-bars-ui", undefined);
  }

  private closeDialog(id: string) {
    this.listener?.("dialog-delete", { id });
  }
}

export const uiAPI = new UIApi();
