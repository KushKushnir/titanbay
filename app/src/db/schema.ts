import { pgTable, pgEnum, uuid, text, integer, numeric, timestamp, date } from 'drizzle-orm/pg-core'

export const fundStatusEnum = pgEnum('fund_status', ['Fundraising', 'Investing', 'Closed'])
export const investorTypeEnum = pgEnum('investor_type', ['Individual', 'Institution', 'Family Office'])

export const funds = pgTable('funds', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    vintageYear: integer('vintage_year').notNull(),
    targetSizeUsd: numeric('target_size_usd', { precision: 20, scale: 2 }).notNull(),
    status: fundStatusEnum('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const investors = pgTable('investors', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    investorType: investorTypeEnum('investor_type').notNull(),
    email: text('email').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const investments = pgTable('investments', {
    id: uuid('id').primaryKey().defaultRandom(),
    investorId: uuid('investor_id').notNull().references(() => investors.id, { onDelete: 'cascade' }),
    fundId: uuid('fund_id').notNull().references(() => funds.id, { onDelete: 'cascade' }),
    amountUsd: numeric('amount_usd', { precision: 20, scale: 2 }).notNull(),
    investmentDate: date('investment_date').notNull(),
})
