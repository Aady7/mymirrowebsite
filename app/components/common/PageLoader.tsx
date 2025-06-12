'use client';

import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  loadingText?: string;
}

const PageLoader = ({ loadingText = "Loading..." }: PageLoaderProps) => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center min-h-screen z-50">
      <Loader2 className="h-8 w-8 animate-spin text-black" />
      <p className="text-black text-sm mt-4 animate-pulse">{loadingText}</p>
    </div>
  );
};

export default PageLoader; 