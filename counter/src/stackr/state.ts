import { State } from "@stackr/sdk/machine";
import { solidityPackedKeccak256 } from "ethers";

export type Player = {
  wallet: string;
  name: string;
  hp: number;
  lastupdate?: number;
  location?: { x: number; y: number };
};

export type WorldState = {
  state: number;
  entities: [];
  players: Player[]
};

export class CounterState extends State<WorldState> {
  constructor(state: WorldState) {
    super(state);
  }

  getRootHash() {
    return solidityPackedKeccak256(["string"], [JSON.stringify(this.state)]);
  }
}
