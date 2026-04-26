import { titanDb } from "./index.js";
import { funds, investors, investments } from "./schema.js";

const seedFunds = await titanDb
    .insert(funds)
    .values([
        {
            name: "Titanbay Growth Fund I",
            vintageYear: 2022,
            targetSizeUsd: "250000000",
            status: "Investing",
        },
        {
            name: "Titanbay Growth Fund II",
            vintageYear: 2024,
            targetSizeUsd: "500000000",
            status: "Fundraising",
        },
    ])
    .returning();

const seedInvestors = await titanDb
    .insert(investors)
    .values([
        {
            name: "Goldman Sachs Asset Management",
            investorType: "Institution",
            email: "investments@gsam.com",
        },
        {
            name: "Jane Smith",
            investorType: "Individual",
            email: "jane.smith@example.com",
        },
    ])
    .returning();

await titanDb.insert(investments).values([
    {
        fundId: seedFunds[0].id,
        investorId: seedInvestors[0].id,
        amountUsd: "50000000",
        investmentDate: "2023-03-15",
    },
    {
        fundId: seedFunds[0].id,
        investorId: seedInvestors[1].id,
        amountUsd: "5000000",
        investmentDate: "2023-06-01",
    },
]);

console.log("Seeded successfully");
process.exit(0);
