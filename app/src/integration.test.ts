import { describe, it, expect, afterAll } from "vitest";
import { app } from "./index.js";
import { titanDb } from "$db/index.js";
import { funds } from "$db/schema.js";
import { eq } from "drizzle-orm";

describe("integration: create and retrieve a fund", () => {
    let createdId: string;

    it("POST /funds creates a fund and GET /funds/:id retrieves it", async () => {
        const createRes = await app.request("/funds", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Integration Test Fund",
                vintage_year: 2024,
                target_size_usd: 1000000,
                status: "Fundraising",
            }),
        });
        expect(createRes.status).toBe(201);
        const created = await createRes.json();
        createdId = created.id;

        const getRes = await app.request(`/funds/${createdId}`);
        expect(getRes.status).toBe(200);
        const retrieved = await getRes.json();
        expect(retrieved.name).toBe("Integration Test Fund");
        expect(retrieved.target_size_usd).toBe(1000000);
    });

    afterAll(async () => {
        await titanDb.delete(funds).where(eq(funds.id, createdId));
    });
});
