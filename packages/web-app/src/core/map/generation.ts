import { ICoordinates } from "../../types";

enum Direction {
  North,
  East,
  South,
  West,
}

interface IRoom {
  x: number;
  y: number;
  width: number;
  height: number;
  corridor?: { from: ICoordinates; to: ICoordinates; direction: Direction };
}

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function moveRoom(room: IRoom, direction: Direction, outerMostRoom: IRoom) {
  const distanceToOuterMostRoom = random(1, 2);
  // find a shared X coordinate between the two rooms
  const sharedX = random(
    (room.x > outerMostRoom.x ? room.x + 1 : outerMostRoom.x) + 1,
    (room.x + room.width < outerMostRoom.x + outerMostRoom.width
      ? room.x + room.width
      : outerMostRoom.x + outerMostRoom.width) - 1
  );
  const sharedY = random(
    (room.y > outerMostRoom.y ? room.y : outerMostRoom.y) + 1,
    (room.y + room.height < outerMostRoom.y + outerMostRoom.height
      ? room.y + room.height
      : outerMostRoom.y + outerMostRoom.height) - 2
  );
  switch (direction) {
    // north
    case Direction.North:
      room.y = outerMostRoom.y - room.height - distanceToOuterMostRoom;
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
        map[mapY][mapX] = isWall ? 1 : 0;
      }
    }
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
          map[mapY - 1][mapX] = 1;
          map[mapY + 1][mapX] = 1;
        }
      }
    });

  return {
    map,
    startCoords: {
      x: Math.abs(startX - (rooms[0].x + Math.floor(rooms[0].width / 2))),
      y: Math.abs(startY - (rooms[0].y + Math.floor(rooms[0].height / 2))),
    },
  };
}
