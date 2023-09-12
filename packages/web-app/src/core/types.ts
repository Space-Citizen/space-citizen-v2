type CellKind = "floor" | "wall";

export interface ICell<K extends CellKind = CellKind> {
  readonly kind: K;
  readonly assetName: string;
  readonly x: number;
  readonly y: number;
}
