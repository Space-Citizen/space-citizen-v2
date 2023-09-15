import { ICoordinates } from "../../types";
import { CellKind } from "../types";
import { random } from "../utils/math";

enum Direction {
  North,
  East,
  South,
  West,
}

export interface IRoom {
  x: number;
  y: number;
  width: number;
  height: number;
  actualCenter?: { x: number; y: number };
  corridor?: { from: ICoordinates; to: ICoordinates; direction: Direction };
}

const minimumSharedWidth = 3;
const minimumSharedHeight = 3;

function generateRooms(count: number): IRoom[] {
  return Array.from({ length: count }).map(() => ({
    x: 0,
    y: 0,
    width: random(5, 10),
    height: random(5, 10),
  }));
}

function getOuterMostRoom(rooms: IRoom[], direction: Direction): IRoom {
  switch (direction) {
    // most north
    case Direction.North:
      return rooms.reduce((prev, curr) => {
        if (curr.y < prev.y) {
          return curr;
        }
        return prev;
      });
    // most east
    case Direction.East:
      return rooms.reduce((prev, curr) => {
        if (curr.x > prev.x) {
          return curr;
        }
        return prev;
      });
    // most south
    case Direction.South:
      return rooms.reduce((prev, curr) => {
        if (curr.y > prev.y) {
          return curr;
        }
        return prev;
      });
    // most west
    case Direction.West:
      return rooms.reduce((prev, curr) => {
        if (curr.x < prev.x) {
          return curr;
        }
        return prev;
      });
  }
}

// Generate a random shared X coordinate between two rooms
function getSharedX(room1: IRoom, room2: IRoom) {
  return random(
    Math.max(room1.x + 1, room2.x + 1), // adding +1 since we need a wall on the left side
    Math.min(room1.x + room1.width - 2, room2.x + room2.width - 2) // removing -2 since we need a wall on the right side and we need to also remove 1 from the width
  );
}

// Generate a random shared X coordinate between two rooms
function getSharedY(room1: IRoom, room2: IRoom) {
  return random(
    Math.max(room1.y + 1, room2.y + 1),
    Math.min(room1.y + room1.height - 2, room2.y + room2.height - 2)
  );
}
function moveRoom(room: IRoom, direction: Direction, outerMostRoom: IRoom) {
  const distanceToOuterMostRoom = random(1, 2);

  const shortestWidth = Math.min(room.width, outerMostRoom.width);
  const shortestHeight = Math.min(room.height, outerMostRoom.height);
  let sharedX: number, sharedY: number;

  // random to decide where to offset the room based on the previous one
  const roomOffsetDirection = random(0, 1) === 1 ? 1 : -1;

  switch (direction) {
    // north
    case Direction.North:
      // move the room to the top of the outerMostRoom
      room.y = outerMostRoom.y - room.height - distanceToOuterMostRoom;
      // Offset the room to the left or right of the outerMostRoom
      room.x =
        outerMostRoom.x +
        random(0, shortestWidth - minimumSharedWidth) * roomOffsetDirection;

      sharedX = getSharedX(room, outerMostRoom);
      // create a corridor from the bottom of this room to the top of the outerMostRoom
      room.corridor = {
        from: {
          x: sharedX,
          y: room.y + room.height - 1,
        },
        to: {
          x: sharedX,
          y: outerMostRoom.y,
        },
        direction,
      };
      break;
    // east
    case Direction.East:
      room.x = outerMostRoom.x + outerMostRoom.width + distanceToOuterMostRoom;

      room.y =
        outerMostRoom.y +
        random(0, shortestHeight - minimumSharedHeight) * roomOffsetDirection;

      sharedY = getSharedY(room, outerMostRoom);

      // create a corridor from the left of this room to the right of the outerMostRoom
      room.corridor = {
        from: {
          x: room.x,
          y: sharedY,
        },
        to: {
          x: outerMostRoom.x + outerMostRoom.width - 1,
          y: sharedY,
        },
        direction,
      };
      break;
    // south
    case Direction.South:
      room.y = outerMostRoom.y + outerMostRoom.height + distanceToOuterMostRoom;
      room.x =
        outerMostRoom.x +
        random(0, shortestWidth - minimumSharedWidth) * roomOffsetDirection;

      sharedX = getSharedX(room, outerMostRoom);
      // create a corridor from the top of this room to the bottom of the outerMostRoom
      room.corridor = {
        from: {
          x: sharedX,
          y: room.y,
        },
        to: {
          x: sharedX,
          y: outerMostRoom.y + outerMostRoom.height - 1,
        },
        direction,
      };
      break;
    // west
    case Direction.West:
      room.x = outerMostRoom.x - room.width - distanceToOuterMostRoom;
      room.y =
        outerMostRoom.y +
        random(0, shortestHeight - minimumSharedHeight) * roomOffsetDirection;

      sharedY = getSharedY(room, outerMostRoom);
      // create a corridor from the right of this room to the left of the outerMostRoom
      room.corridor = {
        from: {
          x: room.x + room.width - 1,
          y: sharedY,
        },
        to: {
          x: outerMostRoom.x,
          y: sharedY,
        },
        direction,
      };
      break;
  }
}

export function generateMap(): {
  map: number[][];
  startCoords: ICoordinates;
  rooms: IRoom[];
} {
  // start by generating many rooms with random sizes, but with more height than width
  const rooms = generateRooms(20);
  // then move them away from each other until none of them overlap and
  // they are between 1 and 2 cells away from each other,
  rooms.slice(1).forEach((room, index) => {
    const direction = random(0, 3); // 0: north, 1: east, 2: south, 3: west
    const outerMostRoom =
      index === 0 ? rooms[0] : getOuterMostRoom(rooms, direction);
    moveRoom(room, direction, outerMostRoom);
  });
  // then connect them with corridors.

  // convert the rooms to a raw-map of 0 and 1
  const westMostRoom = getOuterMostRoom(rooms, Direction.West);
  const northMostRoom = getOuterMostRoom(rooms, Direction.North);

  const startX = westMostRoom.x;
  const startY = northMostRoom.y;

  const map: number[][] = [];
  // write the room on the map
  rooms.forEach((room) => {
    for (let y = 0; y < room.height; y++) {
      for (let x = 0; x < room.width; x++) {
        const isWall =
          x === 0 || x === room.width - 1 || y === 0 || y === room.height - 1;
        const mapX = Math.abs(startX - (room.x + x));
        const mapY = Math.abs(startY - (room.y + y));
        if (map[mapY] === undefined) {
          map[mapY] = [];
        }
        map[mapY][mapX] = isWall ? CellKind.wall : CellKind.floor;
      }
    }
    // also update the room actual center
    room.actualCenter = {
      x: Math.abs(startX - (room.x + Math.floor(room.width / 2))),
      y: Math.abs(startY - (room.y + Math.floor(room.height / 2))),
    };
  });

  // now add the corridors
  rooms
    .filter((room) => !!room.corridor)
    .forEach((room) => {
      const { from, to, direction } = room.corridor;
      const corridorLength =
        direction === Direction.North || direction === Direction.South
          ? Math.abs(from.y - to.y)
          : Math.abs(from.x - to.x);

      for (let i = 0; i <= corridorLength; i++) {
        let mapX = Math.abs(startX - from.x);
        let mapY = Math.abs(startY - from.y);

        if (direction === Direction.North) {
          mapY += i;
        } else if (direction === Direction.East) {
          mapX -= i;
        } else if (direction === Direction.South) {
          mapY -= i;
        } else if (direction === Direction.West) {
          mapX += i;
        }
        if (map[mapY] === undefined) {
          map[mapY] = [];
        }
        map[mapY][mapX] = 0;
        // surround the corridor with walls
        if (direction === Direction.North || direction === Direction.South) {
          map[mapY][mapX - 1] = 1;
          map[mapY][mapX + 1] = 1;
        } else if (
          direction === Direction.East ||
          direction === Direction.West
        ) {
          if (map[mapY - 1] === undefined) {
            map[mapY - 1] = [];
          }
          if (map[mapY + 1] === undefined) {
            map[mapY + 1] = [];
          }
          map[mapY - 1][mapX] = 1;
          map[mapY + 1][mapX] = 1;
        }
      }
      // if we just added a vertical corridor, add a door as well
      if (direction === Direction.North || direction === Direction.South) {
        const doorX = Math.abs(startX - to.x);
        const doorY = Math.abs(startY - to.y);
        map[doorY][doorX] = 2;
      }
    });

  return {
    rooms,
    map,
    startCoords: {
      x: Math.abs(startX - (rooms[0].x + Math.floor(rooms[0].width / 2))),
      y: Math.abs(startY - (rooms[0].y + Math.floor(rooms[0].height / 2))),
    },
  };
}
