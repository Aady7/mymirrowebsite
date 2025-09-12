"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import LookBookCard from '@/app/components/look-book/lookBooklookCard';

interface PublicLookbook {
  id: string;
  name: string;
  color: string;
  avatar: string;
  user_id: string;
  created_at: string;
  outfits: string | null;
  products: string | null;
}

const ExploreLookbooks = () => {
  const router = useRouter();
  const [publicLookbooks, setPublicLookbooks] = useState<PublicLookbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicLookbooks();
  }, []);

  const fetchPublicLookbooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('lookbook')
        .select('*')
        .eq('visibility', 1) // Only public lookbooks
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setPublicLookbooks(data || []);
    } catch (error: any) {
      console.error('Error fetching public lookbooks:', error);
      setError(error.message || 'Failed to load lookbooks');
    } finally {
      setLoading(false);
    }
  };

  const handleViewLookbook = (lookbookId: string) => {
    router.push(`/lookbook/${lookbookId}`);
  };

  const getItemCount = (lookbook: PublicLookbook) => {
    let count = 0;
    if (lookbook.outfits) {
      try {
        const outfits = JSON.parse(lookbook.outfits);
        count += outfits.length;
      } catch (e) {
        // Ignore parse errors
      }
    }
    if (lookbook.products) {
      try {
        const products = JSON.parse(lookbook.products);
        count += products.length;
      } catch (e) {
        // Ignore parse errors
      }
    }
    return count;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-white/20 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-3xl h-96"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Lookbooks</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchPublicLookbooks}
            className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 tracking-wide"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16"
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Explore Lookbooks
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 mb-8"
          >
            Discover amazing style collections from our community
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 text-sm text-gray-400"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              {publicLookbooks.length} Public Lookbooks
            </span>
            <span>•</span>
            <span>Updated daily</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Back to Your Lookbooks */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button
          onClick={() => router.push('/lookbook')}
          className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
        >
          ← Back to Your Lookbooks
        </button>
      </div>

      {/* Lookbooks Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {publicLookbooks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 text-6xl mb-4">👀</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Public Lookbooks Yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your style with the community!</p>
            <button
              onClick={() => router.push('/lookbook')}
              className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 tracking-wide"
            >
              Create Your Lookbook
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {publicLookbooks.map((lookbook, index) => (
              <motion.div
                key={lookbook.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative">
                  <LookBookCard
                    imageUrl={lookbook.avatar}
                    heading={lookbook.name}
                    backgroundColor={lookbook.color}
                    avatarSticker={lookbook.avatar}
                    onView={() => handleViewLookbook(lookbook.id)}
                  />
                  
                  {/* Lookbook Info Overlay */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span>{getItemCount(lookbook)} items</span>
                      <span>•</span>
                      <span>{new Date(lookbook.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Public
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Call to Action */}
      {publicLookbooks.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 py-16"
        >
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Share Your Style?
            </h2>
            <p className="text-gray-600 mb-8">
              Create your own lookbook and inspire others with your unique fashion sense.
            </p>
            <button
              onClick={() => router.push('/lookbook')}
              className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 tracking-wide"
            >
              Create Your Lookbook
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ExploreLookbooks;
