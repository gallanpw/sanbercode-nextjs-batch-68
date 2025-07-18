import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const notes = pgTable('notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Jika Anda ingin membuat tabel lain, definisikan di sini juga
// export const users = pgTable('users', { /* ... */ });