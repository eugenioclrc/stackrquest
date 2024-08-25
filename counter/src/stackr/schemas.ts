import { ActionSchema, SolidityType } from "@stackr/sdk";

export const UpdateCounterSchema = new ActionSchema("update-counter", {
  timestamp: SolidityType.UINT,
  extra: SolidityType.STRING,
});


export const schemas = {
  UpdateCounterSchema,
};
