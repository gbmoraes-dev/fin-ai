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
import { users } from './users'

export const goalStatus = pgEnum('goal_status', [
  'active',
  'completed',
  'archived',
])

export const goals = pgTable(
  'goals',
  {
    id: text()
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    name: text().notNull(),
    description: text().notNull(),
    targetAmountInCents: integer().notNull(),
    currentAmountInCents: integer().default(0).notNull(),
    targetDate: date().notNull(),
    status: goalStatus().default('active').notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().$onUpdate(() => new Date()),
  },
  (table) => [
    index().on(table.userId),
    index().on(table.status),
    index().on(table.targetDate),
    index().on(table.userId, table.status),
  ],
)

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
}))

export type Goal = typeof goals.$inferSelect

export type GoalInsert = typeof goals.$inferInsert
