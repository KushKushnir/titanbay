import { Hono } from "hono";
import { titanDb } from "$db/index.js";
import type { InferSelectModel } from "drizzle-orm";
import { investors } from "$db/schema.js";
import {
    CreateInvestorSchema,
    type CreateInvestor,
} from "$validators/investors.js";
import * as v from "valibot";

const investorsRouter = new Hono();
export default investorsRouter;

function formatInvestor(investor: InferSelectModel<typeof investors>) {
    return {
        id: investor.id,
        name: investor.name,
        investor_type: investor.investorType,
        email: investor.email,
        created_at: investor.createdAt,
    };
}

/**
 * Create a new Investor.
 * Test with:
curl -X POST http://localhost:3000/investors -H 'Content-Type: application/json' -d '{"name":"John Smith","investor_type":"Individual","email":"john.smith@example.com"}'
 * */
investorsRouter.post("/", async (c) => {
    const body = await c.req.json();

    const result = v.safeParse(CreateInvestorSchema, body);
    if (!result.success) return c.json({ error: result.issues[0].message }, 422);
    const validatedResult: CreateInvestor = result.output;

    const [investor] = await titanDb
        .insert(investors)
        .values({
            name: validatedResult.name,
            investorType: validatedResult.investor_type,
            email: validatedResult.email,
        })
        .returning();
    return c.json(formatInvestor(investor), 201);
});

/**
 * List all Investors.
 * Test with:
curl http://localhost:3000/investors
 * */
investorsRouter.get("/", async (c) => {
    const rows = await titanDb.select().from(investors);
    return c.json(
        rows.map((row) => formatInvestor(row)),
        200,
    );
});
