import type { Map } from "../core/map/map";
import { ICell } from "../core/types";
import { IEntity, ICoordinates } from "../types";

export function findPath(
  startCell: ICell,
  target: IEntity,
  map: Map
): ICoordinates[] {
  const endCell = map.getCell(target.x - 1, target.y - 1);
  function explore(
    toExplore: ICoordinates[],
    exploredMap: number[][]
  ): boolean {
    const cell = toExplore.pop();
    if (!cell) {
      return false;
    }
    const { x, y } = cell;
    const previousCellValue = exploredMap[y][x];
    // if target is found
    if (endCell.x === x && endCell.y === y) {
      return true;
    }
    // explore top cell
    if (y - 1 >= 0 && exploredMap[y - 1][x] === 0) {
      exploredMap[y - 1][x] = previousCellValue + 1;
      toExplore.push({ y: y - 1, x });
    }
    // explore bottom cell
    if (y + 1 < exploredMap.length && exploredMap[y + 1][x] === 0) {
      exploredMap[y + 1][x] = previousCellValue + 1;
      toExplore.push({ y: y + 1, x });
    }
    // explore left cell
    if (x - 1 >= 0 && exploredMap[y][x - 1] === 0) {
      exploredMap[y][x - 1] = previousCellValue + 1;
      toExplore.push({ y, x: x - 1 });
    }
    // explore right cell
    if (x + 1 < exploredMap[y].length && exploredMap[y][x + 1] === 0) {
      exploredMap[y][x + 1] = previousCellValue + 1;
      toExplore.push({ y, x: x + 1 });
    }
    return explore(toExplore, exploredMap);
  }

  const exploredMap: number[][] = [];

  map.cells.forEach((cell) => {
    if (!exploredMap[cell.y]) {
      exploredMap[cell.y] = [];
    }
    if (exploredMap[cell.y][cell.x] === undefined) {
      exploredMap[cell.y][cell.x] = cell.solid ? -1 : 0;
    }
  });
  exploredMap[startCell.y][startCell.x] = 2; // start at 2

  const found = explore([startCell], exploredMap);

  if (!found) {
    return [];
  }
  const path: ICoordinates[] = [];
  let x = endCell.x,
    y = endCell.y;
  do {
    path.unshift({ x, y });
    // go left if the value is current - 1
    if (x - 1 >= 0 && exploredMap[y][x - 1] === exploredMap[y][x] - 1) {
      x--;
    }
    // go right if the value is current + 1
    else if (
      x + 1 < exploredMap[y].length &&
      exploredMap[y][x + 1] === exploredMap[y][x] - 1
    ) {
      x++;
    }
    // go up if the value is current + 1
    else if (y - 1 >= 0 && exploredMap[y - 1][x] === exploredMap[y][x] - 1) {
      y--;
    }
    // go down if the value is current + 1
    else if (
      y + 1 < exploredMap.length &&
      exploredMap[y + 1][x] === exploredMap[y][x] - 1
    ) {
      y++;
    } else {
      break;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);
  return path;
}
