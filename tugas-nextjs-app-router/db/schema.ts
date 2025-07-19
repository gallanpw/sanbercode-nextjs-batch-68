import { pgTable, uuid, varchar, text, timestamp, pgEnum, integer, boolean } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);
export const jobApplicationStatusEnum = pgEnum('job_application_status', ['applied', 'interviewing', 'offered', 'rejected']);

// users
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: userRoleEnum('user_role').notNull().default('user'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// applicants
export const applicants = pgTable('applicants', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  full_name: text('full_name').notNull(),
  phone: varchar('phone', { length: 50 }),
  min_salary_expectation: integer('min_salary_expectation').notNull(),
  max_salary_expectation: integer('max_salary_expectation').notNull(),
  summary: text('summary'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// jobs
export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  min_salary_offered: integer('min_salary_offered').notNull(),
  max_salary_offered: integer('max_salary_offered').notNull(),
  is_open: boolean('is_open').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  deleted_at: timestamp('deleted_at').defaultNow().notNull().defaultNow(),
});

// job_applications
export const jobApplications = pgTable('job_applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  applicant_id: uuid('applicant_id').notNull().references(() => applicants.id, { onDelete: 'cascade' }),
  job_id: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  status: jobApplicationStatusEnum('job_application_status').notNull().default('applied'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// job_application_logs
export const jobApplicationLogs = pgTable('job_application_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  job_application_id: uuid('job_application_id').notNull().references(() => jobApplications.id, { onDelete: 'cascade' }),
  status: jobApplicationStatusEnum('job_application_status').notNull(),
  note: text('note'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});