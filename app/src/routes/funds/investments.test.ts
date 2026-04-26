import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";

vi.mock("$db/index.js", () => ({
    titanDb: { select: vi.fn(), insert: vi.fn() },
}));

import { titanDb } from "$db/index.js";
import fundsRouter from "./index.js";

const app = new Hono();
app.route("/funds", fundsRouter);

const fundId = "550e8400-e29b-41d4-a716-446655440000";
const investorId = "770e8400-e29b-41d4-a716-446655440002";

const mockFund = {
    id: fundId,
    name: "Test Fund",
    vintageYear: 2024,
    targetSizeUsd: "250000000",
    status: "Fundraising",
    createdAt: new Date(),
};

const mockInvestment = {
    id: "990e8400-e29b-41d4-a716-446655440004",
    investorId,
    fundId,
    amountUsd: "50000000",
    investmentDate: "2024-03-15",
};

beforeEach(() => vi.clearAllMocks());

describe("GET /funds/:fund_id/investments", () => {
    it("returns 200 with investments for fund", async () => {
        vi.mocked(titanDb.select)
            .mockReturnValueOnce({
                from: vi
                    .fn()
                    .mockReturnValue({ where: vi.fn().mockResolvedValue([mockFund]) }),
            } as any)
            .mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockResolvedValue([mockInvestment]),
                }),
            } as any);

        const res = await app.request(`/funds/${fundId}/investments`);
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body[0].amount_usd).toBe(50000000);
    });

    it("returns 404 when fund not found", async () => {
        vi.mocked(titanDb.select).mockReturnValueOnce({
            from: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([]) }),
        } as any);

        const res = await app.request(`/funds/${fundId}/investments`);
        expect(res.status).toBe(404);
    });

    it("returns 400 for invalid fund UUID", async () => {
        const res = await app.request("/funds/not-a-uuid/investments");
        expect(res.status).toBe(400);
    });
});

describe("POST /funds/:fund_id/investments", () => {
    it("returns 201 with created investment", async () => {
        vi.mocked(titanDb.select).mockReturnValueOnce({
            from: vi
                .fn()
                .mockReturnValue({ where: vi.fn().mockResolvedValue([mockFund]) }),
        } as any);
        vi.mocked(titanDb.insert).mockReturnValue({
            values: vi.fn().mockReturnValue({
                returning: vi.fn().mockResolvedValue([mockInvestment]),
            }),
        } as any);

        const res = await app.request(`/funds/${fundId}/investments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                investor_id: investorId,
                amount_usd: 50000000,
                investment_date: "2024-03-15",
            }),
        });

        expect(res.status).toBe(201);
        expect((await res.json()).fund_id).toBe(fundId);
    });

    it("returns 422 for invalid body", async () => {
        vi.mocked(titanDb.select).mockReturnValueOnce({
            from: vi
                .fn()
                .mockReturnValue({ where: vi.fn().mockResolvedValue([mockFund]) }),
        } as any);

        const res = await app.request(`/funds/${fundId}/investments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount_usd: -100 }),
        });

        expect(res.status).toBe(422);
    });

    it("returns 404 when fund not found", async () => {
        vi.mocked(titanDb.select).mockReturnValueOnce({
            from: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([]) }),
        } as any);

        const res = await app.request(`/funds/${fundId}/investments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                investor_id: investorId,
                amount_usd: 50000000,
                investment_date: "2024-03-15",
            }),
        });

        expect(res.status).toBe(404);
    });
});
