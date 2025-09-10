"use client"
import { useParams, notFound } from 'next/navigation';
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCartArrowDown } from 'react-icons/fa';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import SimilarOutfitsCarousel from '@/app/components/looks/SimilarOutfitsCarousel';
import { addToCart } from '@/lib/utils/cart';
import { useAuth } from '@/lib/hooks/useAuth';
import SmartLoader from '@/app/components/loader/SmartLoader';
import StarRating from '@/app/components/starRating';
import LooksFeedback from '@/app/components/looks/LooksFeedback';
import { supabase } from '@/lib/supabase';
import { CartContext } from '@/app/components/provider';
import { useNotification } from '@/app/components/common/NotificationContext';
import RobustImage from '@/app/components/common/RobustImage';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  created_at: string;
  title: string;
  name: string;
  overallRating: number;
  price: number;
  mrp: number;
  discount: string;
  sizesAvailable: string;
  productImages: string;
  specifications: string;
  tagged_products: {
    customer_short_description: string;
    customer_long_recommendation: string;
    product_key_attributes: string;
    // Enhanced fields from tagged_products
    primary_fabric?: string;
    fabric_texture?: string;
    fabric_weight?: string;
    fabric_care?: string;
    primary_color?: string;
    color_family?: string;
    primary_occasion?: string;
    formality_level?: string;
    fit_type?: string;
    style_category?: string;
    seasonal_appropriateness?: string;
    body_shape_compatibility?: string;
    comfort_level?: string;
    care_complexity?: string;
    versatility_score?: number;
    color_harmony?: string;
  };
}

interface LoadingState {
  [key: string]: boolean;
}

interface KeyAttributes {
  color?: string;
  fit?: string;
  fabric?: string;
  occasion?: string;
  [key: string]: string | undefined;
}

interface OutfitData {
  main_outfit_id: string;
  outfit_name: string;
  outfit_description?: string;
  why_picked_explanation?: string;
  top: {
    id: number;
    title: string;
    image: string;
    style: string;
  };
  bottom: {
    id: number;
    title: string;
    image: string;
    style: string;
  };
}

const LookPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const { getSession } = useAuth();
  const { refreshCart } = useContext(CartContext);
  const { showNotification } = useNotification();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<LoadingState>({});
  const [error, setError] = useState<string | null>(null);
  const [outfitData, setOutfitData] = useState<OutfitData | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoadingOutfit, setIsLoadingOutfit] = useState<boolean>(true);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const hasFetchedOutfit = useRef<boolean>(false);
  const currentId = useRef<string>('');
  const [activeCarouselOutfitId, setActiveCarouselOutfitId] = useState<string | null>(null);
  const [expandedRecommendations, setExpandedRecommendations] = useState<Record<number, boolean>>({});

  // Auth check effect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { session, error } = await getSession();
        setIsCheckingAuth(false);
        
        if (!error && session?.user) {
          setIsAuthenticated(true);
          setCurrentUser(session.user);
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [getSession]);

  // Simplified loader effect
  useEffect(() => {
    if (isLoadingOutfit || isCheckingAuth) {
      setShowLoader(true);
      const timer = setTimeout(() => {
        if (!isLoadingOutfit && !isCheckingAuth) {
          setShowLoader(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [isLoadingOutfit, isCheckingAuth]);

  if (showLoader) {
    return <SmartLoader />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to view your personalized looks.
          </p>
          <div className="space-y-3">
            <Link
              href="/sign-in"
              className="block w-full py-3 px-6 bg-black text-white text-center rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up" 
              className="block w-full py-3 px-6 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Look</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Premium Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-gray-900/5 border border-gray-200 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-medium text-gray-700 tracking-wide">YOUR CURATED LOOK</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight"
            whileHover={{ scale: 1.01 }}
          >
            {outfitData?.outfit_name || 'Premium Look'}
          </motion.h1>
          
          <motion.div 
            className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>

        {/* Coming Soon Message */}
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <h2 className="text-2xl font-light text-gray-600 mb-4">Premium Look Experience</h2>
          <p className="text-gray-500">This enhanced experience is being redesigned for you.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LookPage;
