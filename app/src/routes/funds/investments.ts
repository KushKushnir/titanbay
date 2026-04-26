import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { titanDb } from "$db/index.js";
import { funds, investments } from "$db/schema.js";
import {
    CreateInvestmentSchema,
    type CreateInvestment,
} from "$validators/investments.js";
import * as v from "valibot";
import type { InferSelectModel } from "drizzle-orm";

const investmentsRouter = new Hono();
export default investmentsRouter;

function formatInvestment(investment: InferSelectModel<typeof investments>) {
    return {
        id: investment.id,
        investor_id: investment.investorId,
        fund_id: investment.fundId,
        amount_usd: parseFloat(investment.amountUsd),
        investment_date: investment.investmentDate,
    };
}

/**
* List all investments for a specific fund.
* Test with:
curl http://localhost:3000/funds/INSERTFUNDIDHERE/investments
 * */
investmentsRouter.get("/", async (c) => {
    const fund_id = c.req.param("fund_id");
    if (!v.is(v.pipe(v.string(), v.uuid()), fund_id))
        return c.json({ error: "Invalid fund ID" }, 400);

    const [fund] = await titanDb
        .select()
        .from(funds)
        .where(eq(funds.id, fund_id));
    if (!fund) return c.json({ error: "Fund not found" }, 404);

    const rows = await titanDb
        .select()
        .from(investments)
        .where(eq(investments.fundId, fund_id));
    return c.json(rows.map(formatInvestment), 200);
});

/**
* Create a new investment for a specific fund.
* Test with:
curl -X POST http://localhost:3000/funds/INSERTFUNDIDHERE/investments -H 'Content-Type: application/json' -d '{"investor_id":"INSERTINVESTORIDHERE","amount_usd":75000000,"investment_date":"2024-09-22"}'
* */
investmentsRouter.post("/", async (c) => {
    const fund_id = c.req.param("fund_id");
    if (!v.is(v.pipe(v.string(), v.uuid()), fund_id))
        return c.json({ error: "Invalid fund ID" }, 400);

    const [fund] = await titanDb
        .select()
        .from(funds)
        .where(eq(funds.id, fund_id));
    if (!fund) return c.json({ error: "Fund not found" }, 404);

    const body = await c.req.json();
    const result = v.safeParse(CreateInvestmentSchema, body);
    if (!result.success) return c.json({ error: result.issues[0].message }, 422);
    const validatedResult: CreateInvestment = result.output;

    const [investment] = await titanDb
        .insert(investments)
        .values({
            fundId: fund_id,
            investorId: validatedResult.investor_id,
            amountUsd: String(validatedResult.amount_usd),
            investmentDate: validatedResult.investment_date,
        })
        .returning();

    return c.json(formatInvestment(investment), 201);
});
