import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";

vi.mock("$db/index.js", () => ({
    titanDb: {
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
    },
}));
import { titanDb } from "$db/index.js";
import fundsRouter from "./index.js";

const app = new Hono();
app.route("/funds", fundsRouter);

const mockFund = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Test Fund",
    vintageYear: 2024,
    targetSizeUsd: "250000000",
    status: "Fundraising",
    createdAt: new Date("2024-01-15T10:30:00Z"),
};

beforeEach(() => vi.clearAllMocks());

describe("GET /funds", () => {
    it("returns 200 with array of funds", async () => {
        vi.mocked(titanDb.select).mockReturnValue({
            from: vi.fn().mockResolvedValue([mockFund]),
        } as any);

        const res = await app.request("/funds");
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body[0].vintage_year).toBe(2024);
        expect(body[0].target_size_usd).toBe(250000000);
    });

    it("returns empty array when no funds exist", async () => {
        vi.mocked(titanDb.select).mockReturnValue({
            from: vi.fn().mockResolvedValue([]),
        } as any);

        const res = await app.request("/funds");
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual([]);
    });
});

describe("GET /funds/:id", () => {
    it("returns 200 with fund when found", async () => {
        vi.mocked(titanDb.select).mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockResolvedValue([mockFund]),
            }),
        } as any);

        const res = await app.request(`/funds/${mockFund.id}`);
        expect(res.status).toBe(200);
        expect((await res.json()).id).toBe(mockFund.id);
    });

    it("returns 404 when fund not found", async () => {
        vi.mocked(titanDb.select).mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockResolvedValue([]),
            }),
        } as any);

        const res = await app.request(`/funds/${mockFund.id}`);
        expect(res.status).toBe(404);
    });

    it("returns 400 for invalid UUID", async () => {
        const res = await app.request("/funds/not-a-uuid");
        expect(res.status).toBe(400);
    });
});

describe("POST /funds", () => {
    it("returns 201 with created fund", async () => {
        vi.mocked(titanDb.insert).mockReturnValue({
            values: vi.fn().mockReturnValue({
                returning: vi.fn().mockResolvedValue([mockFund]),
            }),
        } as any);

        const res = await app.request("/funds", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test Fund",
                vintage_year: 2024,
                target_size_usd: 250000000,
                status: "Fundraising",
            }),
        });

        expect(res.status).toBe(201);
        expect((await res.json()).id).toBe(mockFund.id);
    });

    it("returns 422 for invalid body", async () => {
        const res = await app.request("/funds", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "" }),
        });

        expect(res.status).toBe(422);
        expect((await res.json()).error).toBeDefined();
    });
});

describe("PUT /funds", () => {
    it("returns 200 with updated fund", async () => {
        vi.mocked(titanDb.update).mockReturnValue({
            set: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    returning: vi.fn().mockResolvedValue([mockFund]),
                }),
            }),
        } as any);

        const res1 = await app.request("/funds", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: mockFund.id,
                name: "Updated Fund",
                vintage_year: 2024,
                target_size_usd: 300000000,
                status: "Investing",
            }),
        });

        const res2 = await app.request("/funds", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: mockFund.id,
                name: "Updated Fund",
                vintage_year: 2024,
                target_size_usd: 300000000,
                status: "Investing",
            }),
        });

        expect(res1.status).toBe(200);
        expect(res2.status).toBe(200);
    });

    it("returns 422 when id is missing", async () => {
        const res = await app.request("/funds", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Updated Fund",
                vintage_year: 2024,
                target_size_usd: 300000000,
                status: "Investing",
            }),
        });

        expect(res.status).toBe(422);
    });
});
