import { db } from '@/lib/db';
import { jobApplicationsTable } from '@/lib/db/schema';
import { jsonResponse, errorResponse } from '@/utils';
import { count, eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/authOptions';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Proteksi rute: Hanya applicant yang bisa mengakses
    if (!session || session.user?.role !== 'applicant' || !session.user.applicant_id) {
      return errorResponse({ message: 'Unauthorized', status: 401 });
    }

    // Hitung total aplikasi berdasarkan applicant_id dari sesi
    const totalApplicationsResult = await db
      .select({ value: count() })
      .from(jobApplicationsTable)
      .where(eq(jobApplicationsTable.applicant_id, session.user.applicant_id));
    const totalApplications = totalApplicationsResult[0]?.value || 0;

    const data = [
      {
        title: 'My Applications',
        value: totalApplications,
        description: 'Total jobs you have applied for',
      },
    ];

    return jsonResponse({ data });
  } catch (error) {
      console.error('Error fetching applicant reports:', error);
    return errorResponse({ message: 'Failed to fetch applicant reports', status: 500 });
  }
}