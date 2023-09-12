export type IComponentType = "dialog";

export interface IUIComponent {
  id: string;
  content: {
    message: string;
    key?: string;
  };
  type: IComponentType;
}

export type Event = "new" | "delete";
export type EventData<E extends Event> = E extends "new"
  ? IUIComponent
  : E extends "delete"
  ? { id: string }
  : undefined;

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
  public showDialog(message: string, dismissTimeout?: number): () => void {
    const id = (this.eventCounter++).toString();
    this.listener?.("new", {
      id,
      type: "dialog",
      content: { message },
    });

    const dismiss = () => this.closeDialog(id);

    if (dismissTimeout) {
      setTimeout(dismiss, dismissTimeout);
    }

    return dismiss;
  }

  private closeDialog(id: string) {
    this.listener?.("delete", { id });
  }
}

export const uiAPI = new UIApi();
