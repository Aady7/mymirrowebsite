import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LookBookProductProps {
  productImageUrl: string;
  productUrl: string;
  productId: string;
}

const LookBookProduct: React.FC<LookBookProductProps> = ({ 
  productImageUrl, 
  productUrl, 
  productId 
}) => {
  return (
    <Link href={productUrl} className="block">
      <div className="relative w-full max-w-[40vw] mx-auto bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Product Image */}
        <div className="relative w-full h-[280px] max-w-[40vw] sm:h-56 bg-white overflow-hidden">
          <Image
            src={productImageUrl}
            alt={`Product ${productId}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>

        {/* Bottom Section */}
        <div className="w-full h-[60px] bg-gray-200"></div>
      </div>
    </Link>
  );
};

export default LookBookProduct;
