'use client';

import { Suspense } from 'react';
import { useAnalytics } from '@/lib/hooks/useAnalytics';

function AnalyticsTracker() {
  useAnalytics();
  return null;
}

export default function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
} 