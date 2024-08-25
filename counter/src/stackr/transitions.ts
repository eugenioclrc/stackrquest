import { STF, Transitions } from "@stackr/sdk/machine";
import { CounterState } from "./state";
import type {WorldState} from "./state";

import * as ROT from 'rot-js';

const HEIGHT = 100;
const WIDTH = 100;


function getMainLocation() {
    const map = createTileMap(1, 1);
    // Put the player in the first room
    let [playerX, playerY] = map.rooms[0].getCenter();
    return { x: playerX, y: playerY };
}

function removeOldPlayers(state: WorldState) {
    const now = Date.now();
    state.players = state.players.filter((p) => p.lastupdate && (now - (p.lastupdate|| 0)) < 1000 * 60 * 5);
}


function findPlayer(state: WorldState, wallet: string) {
    let index = state.players.findIndex((p) => p.wallet === wallet);
    let p;
    if (index === -1) {
      p = {
        wallet,
        hp: 100,
        name: wallet.slice(0, 15),
        lastupdate: Date.now(),
        location: getMainLocation(),
      };
      state.players.push(p);
      return state.players[state.players.length - 1];
    } else {
      p = state.players[index];
      if(p.hp <= 0) {
        p.hp = 100;
        p.lastupdate = Date.now();
        p.location = getMainLocation();
      }

      return state.players[index];
    }
}

const join: STF<CounterState> = {
  handler: ({ state, emit, msgSender, inputs }) => {
    let extra = { name: msgSender};
    try {
      extra = JSON.parse(inputs.extra)
    } catch (e) {
      // console.log("error", e);
    }

    let name = String(extra.name || String(msgSender));
    // regex onle letter number;
    name = name.replace(/[^a-zA-Z0-9]/g, '');
    name = name.substring(0, 15);

    let player = findPlayer(state, msgSender);
    player.name = name;
    
    state.state += 1;

    emit({ name: "newState", value: state });
    return state;
  },
};


const up: STF<CounterState> = {
  handler: ({ state, emit, msgSender }) => {
    state.state += 1;
    const p = findPlayer(state,msgSender);
    movePlayer(p, 0, -1);
    removeOldPlayers(state);

    emit({ name: "newState", value: state });
    return state;
  },
};
const down: STF<CounterState> = {
  handler: ({ state, emit, msgSender }) => {
    state.state += 1;
    const p = findPlayer(state,msgSender);
    movePlayer(p, 0, +1);
    removeOldPlayers(state);

    emit({ name: "newState", value: state });
    return state;
  },
};

const left: STF<CounterState> = {
  handler: ({ state, emit, msgSender }) => {
    state.state += 1;
    const p = findPlayer(state,msgSender);
    movePlayer(p, -1, 0);
    removeOldPlayers(state);

    emit({ name: "newState", value: state });
    return state;
  },
};
const right: STF<CounterState> = {
  handler: ({ state, emit, msgSender }) => {
    state.state += 1;
    const p = findPlayer(state, msgSender);
    movePlayer(p, 1, 0);
    removeOldPlayers(state);
    

    emit({ name: "newState", value: state });
    return state;
  },
};

export const transitions: Transitions<CounterState> = {
  up,
  down,
  left,
  right,
  join
};

function movePlayer(player: any, dx: number, dy: number) {
    const tileMap = createTileMap(1, 1);
    let x = player.location.x + dx;
    let y = player.location.y + dy;
    if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
      if(tileMap[`${x},${y}`].walkable) {
        player.location.x = x;
        player.location.y = y;
      }
    }
  }


function createTileMap(seed: any, dungeonLevel: any) {
    let tileMap: never[] = [];
    const digger = new ROT.Map.Digger(WIDTH, HEIGHT, {
        roomWidth: [6, 10],
        roomHeight: [6, 10],
        corridorLength: [1, 3],
    });
    digger.create((x, y, contents) => {
        tileMap[`${x},${y}`] = {
            walkable: contents === 0,
            wall: contents === 1,
            explored: false,
        };
    }); 
    tileMap.dungeonLevel = dungeonLevel;
    tileMap.rooms = digger.getRooms();
    tileMap.corridors = digger.getCorridors();


    // Put the player in the first room
    //let [playerX, playerY] = tileMap.rooms[0].getCenter();
    //moveEntityTo(player, {x: playerX, y: playerY});

    // Put stairs in the last room
    //let [stairX, stairY] = tileMap.rooms[tileMap.rooms.length-1].getCenter();
    //createEntity('stairs', {x: stairX, y: stairY});

    // Put monster and items in all the rooms
    //for (let room of tileMap.rooms) {
    //    populateRoom(room, dungeonLevel);
    //}

    //updateTileMapFov(tileMap);
    return tileMap;
}
