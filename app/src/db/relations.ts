import { relations } from 'drizzle-orm'
import { funds, investors, investments } from './schema.js'

export const fundsRelations = relations(funds, ({ many }) => ({
  investments: many(investments),
}))

export const investorsRelations = relations(investors, ({ many }) => ({
  investments: many(investments),
}))

export const investmentsRelations = relations(investments, ({ one }) => ({
  fund: one(funds, { fields: [investments.fundId], references: [funds.id] }),
  investor: one(investors, { fields: [investments.investorId], references: [investors.id] }),
}))
