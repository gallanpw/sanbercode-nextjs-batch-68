"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

export function AttendanceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Normalisasi tanggal hari ini ke YYYY-MM-DD
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set ke awal hari
  const todayString = format(today, 'yyyy-MM-dd');

  const [date, setDate] = useState<string>(searchParams.get('date') || todayString);
  const [studentId, setStudentId] = useState<string>(searchParams.get('studentId') || '');
  const [classId, setClassId] = useState<string>(searchParams.get('classId') || '');
  const [teacherId, setTeacherId] = useState<string>(searchParams.get('teacherId') || '');

  const handleFilter = () => {
    const newSearchParams = new URLSearchParams(); // Mulai dari kosong
    if (date) newSearchParams.set('date', date);
    if (studentId) newSearchParams.set('studentId', studentId);
    if (classId) newSearchParams.set('classId', classId);
    if (teacherId) newSearchParams.set('teacherId', teacherId);

    router.push(`/dashboard/attendance-status?${newSearchParams.toString()}`);
  };

  const handleReset = () => {
    setDate(todayString); // Reset ke tanggal hari ini
    setStudentId('');
    setClassId('');
    setTeacherId('');
    router.push('/dashboard/attendance-status');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="grid gap-2">
        <Label htmlFor="filter-date">Tanggal</Label>
        <Input
          id="filter-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="filter-student-id">ID Siswa</Label>
        <Input
          id="filter-student-id"
          type="text"
          placeholder="ID Siswa (Nano ID)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="filter-class-id">ID Kelas</Label>
        <Input
          id="filter-class-id"
          type="text"
          placeholder="ID Kelas (Nano ID)"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="filter-teacher-id">ID Guru</Label>
        <Input
          id="filter-teacher-id"
          type="text"
          placeholder="ID Guru (Nano ID)"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end space-x-2 mt-4">
        <Button onClick={handleFilter} className="bg-blue-600 hover:bg-blue-700 text-white">
          Terapkan Filter
        </Button>
        <Button onClick={handleReset} variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
          Reset Filter
        </Button>
      </div>
    </div>
  );
}