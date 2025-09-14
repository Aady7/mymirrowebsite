import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LookBookProductProps {
  productImageUrl: string;
  productUrl: string; // Internal product page URL
  affiliateUrl?: string; // External buy URL (Myntra, etc.)
  productId: string;
  productName?: string;
  productPrice?: number;
  productDescription?: string;
  productBrand?: string;
}

const LookBookProduct: React.FC<LookBookProductProps> = ({ 
  productImageUrl, 
  productUrl, 
  affiliateUrl,
  productId,
  productName,
  productPrice,
  productDescription,
  productBrand
}) => {
  return (
    <motion.div 
      className="relative w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200/60 hover:shadow-xl transition-all duration-300 flex flex-col"
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Product Image */}
      <div className="relative w-full h-[280px] sm:h-[320px] bg-gray-50 overflow-hidden">
        <Link href={productUrl} className="block h-full">
          <Image
            src={productImageUrl}
            alt={productName || `Product ${productId}`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
        
        {/* Wishlist button overlay */}
        <div className="absolute top-4 right-4 z-20 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 shadow-lg border border-gray-200/60"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add to wishlist logic here
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="p-4 bg-white flex-1 flex flex-col">
        {/* Top Section - Brand, Name, Description */}
        <div className="flex-1">
          {/* Brand */}
          {productBrand && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {productBrand}
            </p>
          )}
          
          {/* Product Name */}
          {productName && (
            <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
              {productName}
            </h3>
          )}
          
          {/* Description */}
          {productDescription && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
              {productDescription}
            </p>
          )}
        </div>
        
        {/* Bottom Section - Price, Button, Rating */}
        <div className="mt-auto">
          {/* Price and Buy Now Button */}
          <div className="flex items-center justify-between mb-3">
            {productPrice && (
              <div className="flex flex-col">
                <p className="text-lg font-bold text-gray-900">
                  ₹{productPrice.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Free shipping</p>
              </div>
            )}
            
            {/* Buy Now button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Use affiliate URL if available, otherwise fallback to product page
                const buyUrl = affiliateUrl || productUrl;
                window.open(buyUrl, '_blank');
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              Buy Now
            </motion.button>
          </div>
          
          {/* Rating stars */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.0)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LookBookProduct;
