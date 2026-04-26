import { Hono } from "hono";
import { titanDb } from "$db/index.js";
import { funds } from "$db/schema.js";
import {
    CreateFundSchema,
    UpdateFundSchema,
    type CreateFund,
} from "$validators/funds.js";
import { eq, type InferSelectModel } from "drizzle-orm";
import * as v from "valibot";

const fundsRouter = new Hono();
export default fundsRouter;

function formatFund(fund: InferSelectModel<typeof funds>) {
    return {
        id: fund.id,
        name: fund.name,
        vintage_year: fund.vintageYear,
        target_size_usd: parseFloat(fund.targetSizeUsd),
        status: fund.status,
        created_at: fund.createdAt,
    };
}

/**
 * Create a new fund.
 * Test with:
curl -X POST http://localhost:3000/funds -H 'Content-Type: application/json' -d \
'{"name":"Titanbay Growth Fund I","vintage_year":2024,"target_size_usd":250000000,"status":"Fundraising"}';
 * */
fundsRouter.post("/", async (c) => {
    const body = await c.req.json();

    const result = v.safeParse(CreateFundSchema, body);
    if (!result.success) return c.json({ error: result.issues[0].message }, 422);
    const validatedResult: CreateFund = result.output;

    const [fund] = await titanDb
        .insert(funds)
        .values({
            name: validatedResult.name,
            vintageYear: validatedResult.vintage_year,
            targetSizeUsd: String(validatedResult.target_size_usd),
            status: validatedResult.status,
        })
        .returning();
    return c.json(formatFund(fund), 201);
});

/**
 * List all funds
 * Test with:
curl http://localhost:3000/funds
 * */
fundsRouter.get("/", async (c) => {
    const rows = await titanDb.select().from(funds);
    return c.json(
        rows.map((row) => formatFund(row)),
        200,
    );
});

/**
 * Get a specific fund
 * Test with:
curl http://localhost:3000/funds/INSERTIDHERE
 * */
fundsRouter.get("/:id", async (c) => {
    const id = c.req.param("id");
    if (!v.is(v.pipe(v.string(), v.uuid()), id))
        return c.json({ error: "Invalid fund ID" }, 400);
    const [fund] = await titanDb.select().from(funds).where(eq(funds.id, id));
    if (!fund) return c.json({ error: "Fund not found" }, 404);
    return c.json(formatFund(fund));
});

/**
 * Update a specific fund
 * Test with:
curl -X PUT http://localhost:3000/funds -H 'Content-Type: application/json' -d '{"id":"INSERTFUNDIDHERE","name":"Titanbay Shrunk Fund X", "vintage_year":1984,"target_size_usd":3,"status":"Investing"}'
 * */
fundsRouter.put("/", async (c) => {
    const body = await c.req.json();
    const result = v.safeParse(UpdateFundSchema, body);
    if (!result.success) return c.json({ error: result.issues[0].message }, 422);
    const validatedResult = result.output;
    const [fund] = await titanDb
        .update(funds)
        .set({
            name: validatedResult.name,
            vintageYear: validatedResult.vintage_year,
            targetSizeUsd: String(validatedResult.target_size_usd),
            status: validatedResult.status,
        })
        .where(eq(funds.id, validatedResult.id))
        .returning();

    if (!fund) return c.json({ error: "Fund not found" }, 404);
    return c.json(formatFund(fund));
});
