import * as v from "valibot";

export const CreateInvestmentSchema = v.object({
    investor_id: v.pipe(v.string(), v.uuid()),
    amount_usd: v.pipe(v.number(), v.minValue(0)),
    investment_date: v.pipe(v.string(), v.isoDate()),
});

export type CreateInvestment = v.InferOutput<typeof CreateInvestmentSchema>;
