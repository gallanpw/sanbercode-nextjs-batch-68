'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import useFetcher from '@/hooks/useFetcher'; // Untuk fetch data awal
import { ApiResponse, UserType, ApplicantType } from '@/types/common'; // Perlu definisikan ApplicantType
import { useRouter } from 'next/navigation'; // Jika ingin redirect setelah update

// Definisikan tipe gabungan untuk data yang akan diupdate
type ProfileFormData = {
  full_name?: string;
  phone?: string;
  email?: string;
  password?: string;
  min_salary_expectation?: number;
  max_salary_expectation?: number;
  summary?: string;
  socials?: Record<string, string>; // Sesuaikan jika ada struktur sosial spesifik
};

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession(); // update adalah fungsi NextAuth.js
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch data profile awal dari API (jika ada API get profile)
  // Untuk sementara, kita bisa pakai data dari session.user jika sudah cukup.
  // Jika Anda butuh semua data applicant yang mungkin tidak ada di sesi,
  // Anda bisa buat API GET /api/applicant/profile/me
  // const { data: applicantProfile, isLoading: isProfileLoading } = useFetcher<ApiResponse<ApplicantType>>({
  //   path: session?.user?.role === 'applicant' ? `/api/applicant/profile/me` : undefined,
  // });

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setFormData({
        full_name: (session.user as any).full_name || '', // Asumsi full_name ada di sesi
        phone: (session.user as any).phone || '',
        email: session.user.email || '',
        min_salary_expectation: (session.user as any).min_salary_expectation || 0,
        max_salary_expectation: (session.user as any).max_salary_expectation || 0,
        summary: (session.user as any).summary || '',
        socials: (session.user as any).socials || {},
      });
    }
  }, [session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('salary_expectation') ? Number(value) : value,
    }));
  };

  const handleSocialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socials: {
        ...(prev.socials || {}),
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/applicant/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Profile updated successfully!');
        // Opsional: Perbarui sesi NextAuth.js agar data baru tercermin
        // Anda perlu memastikan API PUT Anda mengembalikan data terbaru jika ingin langsung memperbarui sesi
        await updateSession(); // Ini akan memicu refresh sesi dari server
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div>Loading profile...</div>;
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'applicant') {
    router.push('/sign-in'); // Redirect jika tidak login atau bukan applicant
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Update Profile</CardTitle>
        <CardDescription>Update your personal information and preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">New Password (leave blank to keep current)</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password || ''}
              onChange={handleChange}
              placeholder="********"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+628123456789"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="min_salary_expectation">Min Salary Expectation</Label>
              <Input
                id="min_salary_expectation"
                name="min_salary_expectation"
                type="number"
                value={formData.min_salary_expectation}
                onChange={handleChange}
                placeholder="5000000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max_salary_expectation">Max Salary Expectation</Label>
              <Input
                id="max_salary_expectation"
                name="max_salary_expectation"
                type="number"
                value={formData.max_salary_expectation}
                onChange={handleChange}
                placeholder="10000000"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="A brief summary of your skills and experience..."
            />
          </div>
          {/* Contoh untuk socials (JSONB) - bisa diperluas */}
          <div className="grid gap-2">
            <Label>Social Links (e.g., LinkedIn)</Label>
            <Input
              name="linkedin"
              placeholder="LinkedIn URL"
              value={formData.socials?.linkedin || ''}
              onChange={handleSocialsChange}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}