import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";

vi.mock("$db/index.js", () => ({
    titanDb: { select: vi.fn(), insert: vi.fn() },
}));

import { titanDb } from "$db/index.js";
import investorsRouter from "./index.js";

const app = new Hono();
app.route("/investors", investorsRouter);

const mockInvestor = {
    id: "770e8400-e29b-41d4-a716-446655440002",
    name: "Goldman Sachs",
    investorType: "Institution",
    email: "investments@gsam.com",
    createdAt: new Date("2024-02-10T09:15:00Z"),
};

beforeEach(() => vi.clearAllMocks());

describe("GET /investors", () => {
    it("returns 200 with array of investors", async () => {
        vi.mocked(titanDb.select).mockReturnValue({
            from: vi.fn().mockResolvedValue([mockInvestor]),
        } as any);

        const res = await app.request("/investors");
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body[0].investor_type).toBe("Institution");
    });

    it("returns empty array when no investors exist", async () => {
        vi.mocked(titanDb.select).mockReturnValue({
            from: vi.fn().mockResolvedValue([]),
        } as any);

        const res = await app.request("/investors");
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual([]);
    });
});

describe("POST /investors", () => {
    it("returns 201 with created investor", async () => {
        vi.mocked(titanDb.insert).mockReturnValue({
            values: vi.fn().mockReturnValue({
                returning: vi.fn().mockResolvedValue([mockInvestor]),
            }),
        } as any);

        const res = await app.request("/investors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Goldman Sachs",
                investor_type: "Institution",
                email: "investments@gsam.com",
            }),
        });

        expect(res.status).toBe(201);
        expect((await res.json()).investor_type).toBe("Institution");
    });

    it("returns 422 for invalid email", async () => {
        const res = await app.request("/investors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Goldman Sachs",
                investor_type: "Institution",
                email: "not-an-email",
            }),
        });

        expect(res.status).toBe(422);
    });

    it("returns 422 for invalid investor_type", async () => {
        const res = await app.request("/investors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Goldman Sachs",
                investor_type: "Hedge Fund",
                email: "investments@gsam.com",
            }),
        });

        expect(res.status).toBe(422);
    });
});
