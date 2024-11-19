import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core'

export const sessions = pgTable('sessions', {
  session_id: uuid('session_id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  expires_at: timestamp('expires_at').notNull(),
})
