"use client";

import React from 'react';
import Image from 'next/image';

interface BannerStyleReportProps {
  name: string;
}

const BannerStyleReport: React.FC<BannerStyleReportProps> = ({ name }) => {
  return (
    <div 
      className="relative flex flex-col items-center justify-center overflow-hidden h-[200px] rounded-2xl"
      style={{
        width: 'calc(100% - 32px)',
        margin: '0 16px',
        flexShrink: 0
      }}
    >
      {/* Background Image */}
      <Image
        src="/assets/styleReport/stylereportbanner.jpg"
        alt="Style Report Banner"
        fill
        className="object-cover"
        priority
      />
      
      {/* Content Overlay */}
      <div className="absolute top-0 left-0 z-10 flex flex-col text-left pl-6 pr-6 pt-6 items-start w-full overflow-hidden">
        {/* Heading */}
        <h1 
          className="mb-2 break-words"
          style={{
            color: '#131313',
            fontFamily: 'Boston',
            textAlign:'left',
            fontSize: '24px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '1.2',
            letterSpacing: '-0.48px',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            paddingTop:'21px'
          }}
        >
          Styled for you, {name}
        </h1>
        
        {/* Bottom Text */}
        <p 
          className="mb-3 break-words"
          style={{
            color: '#000',
            fontFamily: 'Boston',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '1.4',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          No guesswork, no endless scrolling.<br />
          Just pieces that actually fit you.
        </p>
        
        {/* View All Button */}
        <button 
          className="transition-colors duration-200 flex items-center gap-1 shrink-0"
          style={{
            color: '#000',
            fontFamily: 'Boston',
            fontSize: '10px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: 'normal',
            textDecoration: 'underline',
            whiteSpace: 'nowrap'
          }}
        >
          View All  
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 9" fill="none">
            <g clipPath="url(#clip0_3315_449)">
              <path d="M2.97386 0.927131C2.87159 1.02583 2.81272 1.1611 2.81018 1.3032C2.80763 1.4453 2.86163 1.58259 2.9603 1.68488L5.56551 4.38499L2.8654 6.9902C2.76597 7.08953 2.70954 7.22393 2.70824 7.36446C2.70695 7.50499 2.76091 7.64041 2.85849 7.74154C2.95607 7.84268 3.08947 7.90144 3.22996 7.90518C3.37044 7.90891 3.50678 7.85732 3.60959 7.76151L6.69536 4.7842C6.79762 4.6855 6.8565 4.55023 6.85904 4.40813C6.86158 4.26603 6.80758 4.12874 6.70891 4.02645L3.73161 0.940686C3.63291 0.838424 3.49764 0.779549 3.35554 0.777007C3.21344 0.774465 3.07615 0.828465 2.97386 0.927131Z" fill="black"/>
            </g>
            <defs>
              <clipPath id="clip0_3315_449">
                <rect width="8.57563" height="8.57563" fill="white" transform="translate(8.72754 0.15332) rotate(91.0248)"/>
              </clipPath>
            </defs>
          </svg>
        </button>

      
        
        {/* View More Button */}
     
      </div>
    </div>
  );
};

export default BannerStyleReport;
