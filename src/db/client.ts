import { drizzle } from 'drizzle-orm/node-postgres'
import { env } from '@/env'

export const db = drizzle(env.DATABASE_URL, { casing: 'snake_case' })
