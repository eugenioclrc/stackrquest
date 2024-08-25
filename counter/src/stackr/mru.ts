import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../../stackr.config";
import { counterMachine } from "./machine";
import { UpdateCounterSchema } from "./schemas";

const mru = await MicroRollup({
  config: stackrConfig,
  actionSchemas: [UpdateCounterSchema],
  stateMachines: [counterMachine],
  stfSchemaMap: {
    join: UpdateCounterSchema,
    up: UpdateCounterSchema,
    down: UpdateCounterSchema,
    left: UpdateCounterSchema,
    right: UpdateCounterSchema,
  },
});

await mru.init();

export { mru };
