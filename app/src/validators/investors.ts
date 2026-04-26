import * as v from "valibot";
import { investorTypeEnum } from "$db/schema.js";

export const CreateInvestorSchema = v.object({
    name: v.pipe(v.string(), v.nonEmpty()),
    investor_type: v.picklist(investorTypeEnum.enumValues),
    email: v.pipe(v.string(), v.email()),
});
export type CreateInvestor = v.InferOutput<typeof CreateInvestorSchema>;
