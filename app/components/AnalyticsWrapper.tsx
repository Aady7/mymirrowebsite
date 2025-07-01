'use client';

import { useAnalytics } from '@/lib/hooks/useAnalytics';

export default function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  useAnalytics();
  return <>{children}</>;
} 