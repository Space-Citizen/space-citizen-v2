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

export type Event = "new" | "delete";
export type EventData<E extends Event> = E extends "new"
  ? IUIComponent
  : E extends "delete"
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
    this.listener?.("new", {
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

  private closeDialog(id: string) {
    this.listener?.("delete", { id });
  }
}

export const uiAPI = new UIApi();
