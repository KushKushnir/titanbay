import * as v from "valibot";
import { fundStatusEnum } from "$db/schema.js";

export const CreateFundSchema = v.object({
    name: v.pipe(v.string(), v.nonEmpty()),
    vintage_year: v.pipe(v.number(), v.integer()),
    target_size_usd: v.pipe(v.number(), v.minValue(0)),
    status: v.picklist(fundStatusEnum.enumValues),
});
export type CreateFund = v.InferOutput<typeof CreateFundSchema>;

export const UpdateFundSchema = v.object({
    ...CreateFundSchema.entries,
    id: v.pipe(v.string(), v.uuid()),
});
export type UpdateFund = v.InferOutput<typeof UpdateFundSchema>;
