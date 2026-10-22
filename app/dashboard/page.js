'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import AdminDashboard from '../../components/admin/AdminDashboard';
import Container from '../../components/layout/Container';

export default function DashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      router.replace('/login');
      return;
    }

    if (role !== 'admin') {
      router.replace('/');
      return;
    }

    setIsAdmin(true);
  }, [router]);

  if (!isAdmin) {
    return (
      <Container className="py-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-bone" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-bone" />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-bone" />
          ))}
        </div>

        <div className="mt-6 h-72 animate-pulse rounded-2xl bg-bone" />
      </Container>
    );
  }

  return <AdminDashboard />;
}
