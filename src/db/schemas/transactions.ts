import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { categories } from './categories'
import { users } from './users'

export const transactionTypes = pgEnum('transaction_types', [
  'income',
  'expense',
])

export const transactions = pgTable(
  'transactions',
  {
    id: text()
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    categoryId: text()
      .references(() => categories.id, { onDelete: 'cascade' })
      .notNull(),
    amountInCents: integer().notNull(),
    description: text().notNull(),
    type: transactionTypes().notNull(),
    date: date().notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().$onUpdate(() => new Date()),
  },
  (table) => [
    index().on(table.userId),
    index().on(table.categoryId),
    index().on(table.type),
    index().on(table.date),
    index().on(table.userId, table.date),
  ],
)

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}))

export type Transaction = typeof transactions.$inferSelect

export type TransactionInsert = typeof transactions.$inferInsert
