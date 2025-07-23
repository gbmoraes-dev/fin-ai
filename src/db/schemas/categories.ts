import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { index, pgTable, text } from 'drizzle-orm/pg-core'
import { transactions } from './transactions'

export const categories = pgTable(
  'categories',
  {
    id: text()
      .$defaultFn(() => createId())
      .primaryKey(),
    name: text().notNull(),
    icon: text().notNull(),
    color: text().notNull(),
  },
  (table) => [index().on(table.name)],
)

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}))

export type Category = typeof categories.$inferSelect

export type CategoryInsert = typeof categories.$inferInsert
