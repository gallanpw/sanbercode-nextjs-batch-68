'use client';

import CardReports from '@/components/section/card-reports'
import { Separator } from '@/components/ui/separator'
import AdminDashboardJobTable from './job-table'

import useFetcher from '@/hooks/useFetcher';
import { ApiResponse } from '@/types/common';
import { CardReportItem } from '@/types/common';

export default function AdminDashboardContainer() {
  const { data: adminReports, isLoading } = useFetcher<ApiResponse<CardReportItem[]>>({
    path: '/admin/reports',
  });

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4">
        <CardReports items={adminReports?.data || []} />
        {/* <CardReports
          items={[{ title: 'Job', value: 5, description: 'Jobs Opening' }]}
        /> */}
        <Separator />
        <AdminDashboardJobTable />
      </div>
    </div>
  )
}
