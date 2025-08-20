'use client';

import { usePathname } from 'next/navigation';
import Footer from './footer';

const ConditionalFooter = () => {
  const pathname = usePathname();
  
  // Hide footer on style quiz pages
  const hideFooter = pathname === '/style-quiz-new' || pathname === '/style-quiz';
  
  if (hideFooter) {
    return null;
  }
  
  return <Footer />;
};

export default ConditionalFooter;
