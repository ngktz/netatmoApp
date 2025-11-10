import { Suspense } from 'react';
import HomePage from '@/components/HomePage';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <HomePage />
    </Suspense>
  );
}