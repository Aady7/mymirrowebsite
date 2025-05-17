import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 md:block">
      <div className="max-w-7xl mx-auto py-4 md:py-8 px-4 md:px-8">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-8">
          {/* About Section */}
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-sm md:text-base font-semibold text-[#007e90]">About Style Quiz</h3>
            <p className="text-xs md:text-sm text-gray-600 hidden md:block">
              Discover your unique style and get personalized fashion recommendations 
              that match your personality.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-sm md:text-base font-semibold text-[#007e90]">Quick Links</h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link 
                  href="/recommendations" 
                  className="text-xs md:text-sm text-gray-600 hover:text-[#007e90] transition-colors inline-flex items-center"
                >
                  <span>Recommendations</span>
                  <svg className="w-3 h-3 md:w-4 md:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link 
                  href="/style-guide" 
                  className="text-xs md:text-sm text-gray-600 hover:text-[#007e90] transition-colors inline-flex items-center"
                >
                  <span>Style Guide</span>
                  <svg className="w-3 h-3 md:w-4 md:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
              <li className="hidden md:block">
                <Link 
                  href="/help" 
                  className="text-xs md:text-sm text-gray-600 hover:text-[#007e90] transition-colors inline-flex items-center"
                >
                  <span>Help & Support</span>
                  <svg className="w-3 h-3 md:w-4 md:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-sm md:text-base font-semibold text-[#007e90]">Need Help?</h3>
            <div className="space-y-1 md:space-y-2">
              <a 
                href="mailto:support@stylequiz.com" 
                className="text-xs md:text-sm text-gray-600 hover:text-[#007e90] transition-colors flex items-center"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="hidden md:inline">support@stylequiz.com</span>
                <span className="md:hidden">Email Us</span>
              </a>
              <a 
                href="tel:+911234567890" 
                className="text-xs md:text-sm text-gray-600 hover:text-[#007e90] transition-colors flex items-center"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="hidden md:inline">+91 1234567890</span>
                <span className="md:hidden">Call Us</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 md:mt-8 pt-3 md:pt-6 border-t border-gray-100">
          <p className="text-center text-[10px] md:text-xs text-gray-500">
            © {new Date().getFullYear()} Style Quiz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 