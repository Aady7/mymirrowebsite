'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const StyleQuizNewRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new style quiz route
    router.replace('/style-quiz');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Redirecting to the new style quiz...</p>
      </div>
    </div>
  );
};

export default StyleQuizNewRedirect;