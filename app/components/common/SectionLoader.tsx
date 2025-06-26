import React from 'react';

interface SectionLoaderProps {
  text: string;
}

const SectionLoader: React.FC<SectionLoaderProps> = ({ text }) => (
  <div className="flex flex-col items-center justify-center space-y-4 py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007e90]"></div>
    <p className="text-gray-600">{text}</p>
  </div>
);

export default SectionLoader; 