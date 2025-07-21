import { db } from '@/lib/db';
import { usersTable, applicantsTable } from '@/lib/db/schema';
import { jsonResponse, errorResponse } from '@/utils';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import bcrypt from 'bcryptjs'; // Untuk hashing password jika diubah

// Skema validasi untuk data update profile (Anda perlu membuat ini)
// Contoh:
// import { formUpdateProfileSchema } from '@/types/form-schema';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'applicant' || !session.user.id || !session.user.applicant_id) {
      return errorResponse({ message: 'Unauthorized', status: 401 });
    }

    const body = await req.json();

    // === Validasi Input ===
    // Anda perlu membuat skema validasi (misal, menggunakan Zod)
    // const parse = formUpdateProfileSchema.safeParse(body);
    // if (!parse.success) {
    //   return errorResponse({
    //     message: 'Validation error',
    //     errors: parse.error.flatten().fieldErrors,
    //     status: 400,
    //   });
    // }
    // const { full_name, phone, email, password, min_salary_expectation, max_salary_expectation, summary, socials } = parse.data;

    // Untuk contoh ini, kita asumsikan body langsung berisi data
    const { full_name, phone, email, password, min_salary_expectation, max_salary_expectation, summary, socials } = body;

    await db.transaction(async (tx) => {
      // Update data di usersTable
      const userUpdateData: { email?: string; password?: string } = {};
      if (email && email !== session.user.email) { // Hanya update jika email berubah
        // Opsional: Cek apakah email baru sudah terdaftar
        const existingUserWithNewEmail = await tx.select().from(usersTable).where(eq(usersTable.email, email));
        if (existingUserWithNewEmail.length > 0 && existingUserWithNewEmail[0].id !== session.user.id) {
          throw new Error('Email is already registered by another user');
        }
        userUpdateData.email = email;
      }
      if (password) {
        userUpdateData.password = await bcrypt.hash(password, 10); // Hash password baru
      }
      if (Object.keys(userUpdateData).length > 0) {
        await tx.update(usersTable).set(userUpdateData).where(eq(usersTable.id, session.user.id));
      }

      // Update data di applicantsTable
      const applicantUpdateData: any = {}; // Ganti any dengan tipe yang lebih spesifik
      if (full_name) applicantUpdateData.full_name = full_name;
      if (phone) applicantUpdateData.phone = phone;
      if (min_salary_expectation !== undefined) applicantUpdateData.min_salary_expectation = Number(min_salary_expectation);
      if (max_salary_expectation !== undefined) applicantUpdateData.max_salary_expectation = Number(max_salary_expectation);
      if (summary) applicantUpdateData.summary = summary;
      if (socials) applicantUpdateData.socials = socials; // Untuk jsonb

      if (Object.keys(applicantUpdateData).length > 0) {
        await tx.update(applicantsTable).set(applicantUpdateData).where(eq(applicantsTable.user_id, session.user.id));
      }
    });

    return jsonResponse({ data: { message: 'Profile updated successfully' } });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return errorResponse({ message: error.message || 'Failed to update profile', status: 500 });
  }
}