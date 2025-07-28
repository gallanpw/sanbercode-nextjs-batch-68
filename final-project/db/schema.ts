import { pgTable, text, timestamp, boolean, pgEnum, uniqueIndex, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// Enum untuk peran pengguna
export const userRoleEnum = pgEnum('user_role', ['admin', 'teacher', 'student']);

// Tabel Users
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    emailIdx: uniqueIndex('email_idx').on(table.email),
  };
});

// Relasi untuk tabel users
export const usersRelations = relations(users, ({ one, many }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
    relationName: 'user_to_student', // Nama relasi unik
  }),
  teacher: one(teachers, {
    fields: [users.id],
    references: [teachers.userId],
    relationName: 'user_to_teacher', // Nama relasi unik
  }),
  // Relasi balik untuk absensi siswa yang dicatat oleh user
  recordedStudentAttendances: many(attendances, { relationName: 'attendance_recorded_by_user' }),
  // Relasi balik untuk absensi guru yang dicatat oleh user
  recordedTeacherAbsencesByUsers: many(teacherAbsences, { relationName: 'teacher_absence_recorded_by_user' }),
}));

// Tabel Students
export const students = pgTable('students', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  studentIdNumber: text('student_id_number').unique().notNull(),
  grade: text('grade').notNull(),
  dateOfBirth: timestamp('date_of_birth', { mode: 'date' }),
  address: text('address'),
  phoneNumber: text('phone_number'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    studentIdNumberIdx: uniqueIndex('student_id_number_idx').on(table.studentIdNumber),
  };
});

// Relasi untuk tabel students
export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
    relationName: 'user_to_student', // Harus cocok dengan relasi balik di users
  }),
  attendances: many(attendances),
}));

// Tabel Teachers
export const teachers = pgTable('teachers', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  teacherIdNumber: text('teacher_id_number').unique().notNull(),
  subjectTaught: text('subject_taught').notNull(),
  phoneNumber: text('phone_number'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    teacherIdNumberIdx: uniqueIndex('teacher_id_number_idx').on(table.teacherIdNumber),
  };
});

// Relasi untuk tabel teachers
export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id],
    relationName: 'user_to_teacher', // Harus cocok dengan relasi balik di users
  }),
  classes: many(classes),
  absences: many(teacherAbsences, { relationName: 'absent_teacher_absences' }), // Relasi unik
  replacements: many(teacherAbsences, { relationName: 'replacement_teacher_absences' }), // Relasi unik
}));

// Tabel Classes
export const classes = pgTable('classes', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  description: text('description'),
  teacherId: text('teacher_id').references(() => teachers.id, { onDelete: 'set null' }),
  classCode: text('class_code').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    classCodeIdx: uniqueIndex('class_code_idx').on(table.classCode),
  };
});

// Relasi untuk tabel classes
export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [classes.teacherId],
    references: [teachers.id],
  }),
  attendances: many(attendances),
}));

// Enum untuk status absensi
export const attendanceStatusEnum = pgEnum('attendance_status', ['present', 'absent', 'late', 'sick', 'excused']);

// Tabel Attendances
export const attendances = pgTable('attendances', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  studentId: text('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  classId: text('class_id').references(() => classes.id, { onDelete: 'cascade' }).notNull(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  status: attendanceStatusEnum('status').notNull(),
  recordedByUserId: text('recorded_by_user_id').references(() => users.id, { onDelete: 'set null' }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    unqAttendance: uniqueIndex('unq_attendance_idx').on(table.studentId, table.classId, table.date),
  };
});

// Relasi untuk tabel attendances
export const attendancesRelations = relations(attendances, ({ one }) => ({
  student: one(students, {
    fields: [attendances.studentId],
    references: [students.id],
  }),
  class: one(classes, {
    fields: [attendances.classId],
    references: [classes.id],
  }),
  recordedByUser: one(users, {
    fields: [attendances.recordedByUserId],
    references: [users.id],
    relationName: 'attendance_recorded_by_user', // Nama relasi unik
  }),
}));

// Tabel Baru: TeacherAbsences
export const teacherAbsences = pgTable('teacher_absences', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  teacherId: text('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }).notNull(),
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { mode: 'date' }).notNull(),
  reason: text('reason').notNull(),
  replacementTeacherId: text('replacement_teacher_id').references(() => teachers.id, { onDelete: 'set null' }),
  recordedByUserId: text('recorded_by_user_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relasi untuk tabel teacherAbsences
export const teacherAbsencesRelations = relations(teacherAbsences, ({ one }) => ({
  absentTeacher: one(teachers, {
    fields: [teacherAbsences.teacherId],
    references: [teachers.id],
    relationName: 'absent_teacher_absences', // Harus cocok dengan relasi balik di teachers
  }),
  replacementTeacher: one(teachers, {
    fields: [teacherAbsences.replacementTeacherId],
    references: [teachers.id],
    relationName: 'replacement_teacher_absences', // Harus cocok dengan relasi balik di teachers
  }),
  recordedByUser: one(users, {
    fields: [teacherAbsences.recordedByUserId],
    references: [users.id],
    relationName: 'teacher_absence_recorded_by_user', // Nama relasi unik
  }),
}));

// Tabel Baru: TeacherAttendances
export const teacherAttendances = pgTable('teacher_attendances', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  teacherId: text('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }).notNull(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  status: attendanceStatusEnum('status').notNull(), // Bisa pakai enum yang sama
  recordedByUserId: text('recorded_by_user_id').references(() => users.id, { onDelete: 'set null' }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    unqTeacherAttendance: uniqueIndex('unq_teacher_attendance_idx').on(table.teacherId, table.date),
  };
});

// Relasi untuk tabel teacherAttendances
export const teacherAttendancesRelations = relations(teacherAttendances, ({ one }) => ({
  teacher: one(teachers, {
    fields: [teacherAttendances.teacherId],
    references: [teachers.id],
  }),
  recordedByUser: one(users, {
    fields: [teacherAttendances.recordedByUserId],
    references: [users.id],
    relationName: 'teacher_attendance_recorded_by_user', // Nama relasi unik
  }),
}));

// Tambahkan relasi balik di usersRelations (jika belum ada)
// Pastikan Anda menambahkan ini ke usersRelations di atas:
// export const usersRelations = relations(users, ({ one, many }) => ({
//   // ... relasi lain
//   recordedTeacherAttendances: many(teacherAttendances, { relationName: 'teacher_attendance_recorded_by_user' }),
// }));

// Tambahkan relasi balik di teachersRelations (jika belum ada)
// Pastikan Anda menambahkan ini ke teachersRelations di atas:
// export const teachersRelations = relations(teachers, ({ one, many }) => ({
//   // ... relasi lain
//   attendances: many(teacherAttendances), // Relasi dari teacher ke teacherAttendances
// }));