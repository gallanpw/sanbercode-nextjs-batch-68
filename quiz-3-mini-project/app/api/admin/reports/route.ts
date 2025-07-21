import { db } from '@/lib/db';
import { usersTable, jobsTable, jobApplicationsTable } from '@/lib/db/schema';
import { jsonResponse, errorResponse } from '@/utils'; // Pastikan ini ada di utils Anda
import { count, eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth'; // Untuk mengecek sesi
import { authOptions } from '../../auth/[...nextauth]/authOptions'; // Import authOptions Anda

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Proteksi rute: Hanya admin yang bisa mengakses
    if (!session || session.user?.role !== 'admin') {
      return errorResponse({ message: 'Unauthorized', status: 401 });
    }

    // Hitung total applicants (asumsi role 'applicant' di usersTable)
    const totalApplicantsResult = await db
      .select({ value: count() })
      .from(usersTable)
      .where(eq(usersTable.role, 'applicant'));
    const totalApplicants = totalApplicantsResult[0]?.value || 0;

    // Hitung total jobs
    const totalJobsResult = await db
      .select({ value: count() })
      .from(jobsTable);
    const totalJobs = totalJobsResult[0]?.value || 0;

    // Hitung total job applications
    const totalJobApplicationsResult = await db
      .select({ value: count() })
      .from(jobApplicationsTable);
    const totalJobApplications = totalJobApplicationsResult[0]?.value || 0;

    const data = [
      {
        title: 'Applicants',
        value: totalApplicants,
        description: 'Total registered applicants',
      },
      {
        title: 'Jobs',
        value: totalJobs,
        description: 'Total jobs available',
      },
      {
        title: 'Job Applications',
        value: totalJobApplications,
        description: 'Total job applications submitted',
      },
    ];

    return jsonResponse({ data });
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    return errorResponse({ message: 'Failed to fetch admin reports', status: 500 });
  }
}