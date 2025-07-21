'use client';

import CardReports from '@/components/section/card-reports'
import { Separator } from '@/components/ui/separator'
import ApplicationsTable from './applications-table'

import useFetcher from '@/hooks/useFetcher';
import { ApiResponse, CardReportItem, JobType } from '@/types/common';
import { useMemo } from 'react'

export default function ApplicantDashboardContainer() {
  const { data: applicantReports, isLoading } = useFetcher<ApiResponse<CardReportItem[]>>({
    path: '/applicant/reports',
  });

  const { data: jobsData, isLoading: isLoadingJobs } = useFetcher<ApiResponse<JobType[]>>({
    path: '/jobs',
  });

  // Hitung jobs opening secara dinamis
  const jobsOpeningCount = useMemo(() => {
    if (!jobsData?.data) return 0
    // Filter jobs yang is_open: true
    return jobsData.data.filter(job => job.is_open).length
  }, [jobsData])

  const cardItems = [
    { title: 'Job', value: jobsOpeningCount, description: 'Jobs Opening' },
  ]

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4">
          {isLoading ? (
            <div>Loading reports...</div> // Atau Skeleton
          ) : (
            <CardReports items={applicantReports?.data || []} />
          )}

          {isLoadingJobs ? (
            <div>Loading Jobs...</div> // Placeholder loading
          ) : (
            <CardReports items={cardItems} />
          )}

          {/* <CardReports
            items={[{ title: 'Job', value: 5, description: 'Jobs Opening' }]}
          /> */}
        <Separator />
        <ApplicationsTable />
      </div>
    </div>
  )
}
