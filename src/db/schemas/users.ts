import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { index, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { goals } from './goals'
import { transactions } from './transactions'

export const plans = pgEnum('plans', ['free', 'pro'])

export const currencies = pgEnum('currencies', ['BRL', 'USD', 'EUR'])

export const users = pgTable(
  'users',
  {
    id: text()
      .$defaultFn(() => createId())
      .primaryKey(),
    name: text().notNull(),
    email: text().unique().notNull(),
    password: text().notNull(),
    currency: currencies().default('BRL').notNull(),
    plan: plans().default('free').notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().$onUpdate(() => new Date()),
  },
  (table) => [index().on(table.plan)],
)

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  goals: many(goals),
}))

export type User = typeof users.$inferSelect

export type UserInsert = typeof users.$inferInsert
