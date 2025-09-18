"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
// Custom icon components to replace Heroicons
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);
import EnhancedLookBookCard from '../look-book/EnhancedLookBookCard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/hooks/useAuth';
import { isAdminForUI, canAccessAdvancedEdit, hasSessionAdminAccess } from '@/lib/utils/admin';

interface LookbookData {
  id: string;
  name: string;
  color: string;
  avatar: string;
  custom_avatar_url?: string;
  visibility: number;
  likes_count: number;
  views_count: number;
  is_premium: boolean;
  creator_type: string;
  verification_badge?: string;
  bio?: string;
  social_links?: string;
  price_tier: string;
  featured_until?: string;
  total_engagement_score: number;
  user_id: string;
  users_updated?: {
    email_address: string;
  };
  outfits?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  filter: (lookbook: LookbookData) => boolean;
  icon: string;
}

const NetflixStyleExplore: React.FC = () => {
  const { getSession } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [lookbooks, setLookbooks] = useState<LookbookData[]>([]);
  const [userLikes, setUserLikes] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredLookbook, setFeaturedLookbook] = useState<LookbookData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('featured');
  const [isAdmin, setIsAdmin] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set(['featured', 'new']));

  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const categories: Category[] = [
    {
      id: 'featured',
      name: 'Featured',
      description: 'Hand-picked premium lookbooks',
      filter: (lookbook) => lookbook.featured_until ? new Date(lookbook.featured_until) > new Date() : false,
      icon: '🔥'
    },
    {
      id: 'new',
      name: 'New Arrivals',
      description: 'Fresh lookbooks just added',
      filter: () => true, // Will be sorted by created_at
      icon: '✨'
    },
    {
      id: 'trending',
      name: 'Trending Now',
      description: 'Most popular lookbooks this week',
      filter: (lookbook) => lookbook.total_engagement_score > 50,
      icon: '📈'
    },
    {
      id: 'premium',
      name: 'Premium Collection',
      description: 'Exclusive premium content',
      filter: (lookbook) => lookbook.is_premium,
      icon: '⭐'
    },
    {
      id: 'influencers',
      name: 'Influencer Picks',
      description: 'Curated by top influencers',
      filter: (lookbook) => lookbook.creator_type === 'influencer' || lookbook.creator_type === 'celebrity',
      icon: '👑'
    },
    {
      id: 'popular',
      name: 'Most Liked',
      description: 'Community favorites',
      filter: (lookbook) => (lookbook.likes_count || 0) > 0,
      icon: '❤️'
    }
  ];

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      const { session } = await getSession();
      if (session?.user) {
        setUser(session.user);
        setIsAdmin(isAdminForUI(session.user.email));
      }
    };
    
    checkSessionAndFetch();
    fetchLookbooks();
  }, [getSession]);

  const fetchLookbooks = async () => {
    try {
      setLoading(true);

      // Fetch all public lookbooks with engagement data
      const { data, error } = await supabase
        .from('lookbook')
        .select(`
          *,
          users_updated!inner(email_address)
        `)
        .eq('visibility', 1)
        .order('total_engagement_score', { ascending: false });

      if (error) throw error;

      setLookbooks(data || []);

      // Set featured lookbook (highest engagement score that's featured)
      const featured = data?.find(book => 
        book.featured_until && new Date(book.featured_until) > new Date()
      ) || data?.[0];
      setFeaturedLookbook(featured || null);

      // Get user's likes if authenticated
      if (user && data?.length) {
        const lookbookIds = data.map(book => book.id);
        const { data: likesData, error: likesError } = await supabase
          .from('lookbook_likes')
          .select('lookbook_id')
          .eq('user_id', user.id)
          .in('lookbook_id', lookbookIds);
          
        if (!likesError && likesData) {
          setUserLikes(likesData.map(like => like.lookbook_id));
        }
      }
    } catch (error) {
      console.error('Error fetching lookbooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLookbooksByCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];

    let filtered = lookbooks.filter(category.filter);

    // Special sorting for different categories
    switch (categoryId) {
      case 'featured':
        filtered = filtered.sort((a, b) => b.total_engagement_score - a.total_engagement_score);
        break;
      case 'trending':
        filtered = filtered.sort((a, b) => b.total_engagement_score - a.total_engagement_score);
        break;
      case 'new':
        filtered = lookbooks.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).slice(0, 20);
        break;
      case 'popular':
        filtered = filtered.sort((a, b) => b.likes_count - a.likes_count);
        break;
      default:
        filtered = filtered.sort((a, b) => b.total_engagement_score - a.total_engagement_score);
    }

    return filtered.slice(0, 20); // Limit to 20 items per category
  };

  const toggleAccordion = (categoryId: string) => {
    setOpenAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const scroll = (categoryId: string, direction: 'left' | 'right') => {
    const element = scrollRefs.current[categoryId];
    if (element) {
      // Mobile: w-64 (256px) + gap 12px = 268px, Desktop: w-72 (288px) + gap 16px = 304px
      const isMobile = window.innerWidth < 640;
      const scrollAmount = isMobile ? 268 : 304;
      element.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleLike = async (lookbookId: string) => {
    if (!user) {
      alert('Please sign in to like lookbooks');
      return;
    }

    try {
      const { error } = await supabase
        .from('lookbook_likes')
        .insert([{
          lookbook_id: parseInt(lookbookId),
          user_id: user.id
        }]);

      if (error && error.code !== '23505') throw error; // Ignore duplicate key errors

      setUserLikes(prev => [...prev, parseInt(lookbookId)]);
      setLookbooks(prev => prev.map(book => 
        book.id === lookbookId 
          ? { ...book, likes_count: (book.likes_count || 0) + 1 }
          : book
      ));
    } catch (error) {
      console.error('Error liking lookbook:', error);
    }
  };

  const handleUnlike = async (lookbookId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('lookbook_likes')
        .delete()
        .eq('lookbook_id', parseInt(lookbookId))
        .eq('user_id', user.id);

      if (error) throw error;

      setUserLikes(prev => prev.filter(id => id !== parseInt(lookbookId)));
      setLookbooks(prev => prev.map(book => 
        book.id === lookbookId 
          ? { ...book, likes_count: Math.max(0, (book.likes_count || 0) - 1) }
          : book
      ));
    } catch (error) {
      console.error('Error unliking lookbook:', error);
    }
  };

  const handleView = async (lookbookId: string) => {
    // Record view before navigating
    try {
      const viewData: any = {
        lookbook_id: parseInt(lookbookId),
        view_date: new Date().toDateString()
      };

      if (user) {
        viewData.user_id = user.id;
      } else {
        // Get IP for anonymous views
        const response = await fetch('/api/get-ip');
        const { ip } = await response.json();
        viewData.ip_address = ip;
      }

      await supabase.from('lookbook_views').insert([viewData]);
    } catch (error) {
      console.error('Error recording view:', error);
    }

    // Navigate to lookbook
    window.location.href = `/lookbook/${lookbookId}`;
  };

  const handleShare = async (lookbook: any) => {
    try {
      const shareUrl = `${window.location.origin}/lookbook/${lookbook.id}`;
      const shareText = `Check out "${lookbook.name}" by ${lookbook.users_updated?.email_address?.split('@')[0] || 'a creator'} on MyMirro!`;
      
      if (navigator.share) {
        await navigator.share({
          title: lookbook.name,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch (error) {
      try {
        const shareUrl = `${window.location.origin}/lookbook/${lookbook.id}`;
        await navigator.clipboard.writeText(shareUrl);
      } catch (clipboardError) {
        console.error('Error sharing/copying to clipboard:', error, clipboardError);
      }
    }
  };

  const handleEnhancedEdit = (lookbook: LookbookData) => {
    // Check admin access before allowing enhanced edit
    if (!hasSessionAdminAccess() && !canAccessAdvancedEdit(user?.email)) {
      alert('Access denied. Advanced edit features require admin privileges.');
      return;
    }
    
    // For now, redirect to the main lookbook page for editing
    // In the future, you could open a modal here
    window.location.href = `/lookbook`;
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading lookbooks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Section - Featured Lookbook */}
      {featuredLookbook && (
        <div className="relative h-[80vh] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundColor: featuredLookbook.color || '#6B46C1',
                background: `linear-gradient(135deg, ${featuredLookbook.color || '#6B46C1'} 0%, ${featuredLookbook.color || '#9333EA'} 100%)`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-8 max-w-6xl">
              <div className="max-w-2xl">
                {/* Featured Badge */}
                <div className="flex items-center mb-4">
                  <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">
                    FEATURED
                  </span>
                  {featuredLookbook.is_premium && (
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-bold">
                      PREMIUM
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                  {featuredLookbook.name}
                </h1>

                {/* Creator Info */}
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    {featuredLookbook.custom_avatar_url ? (
                      <Image
                        src={featuredLookbook.custom_avatar_url}
                        alt="Creator"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-sm">
                        {featuredLookbook.users_updated?.email_address?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-lg">
                    by {featuredLookbook.users_updated?.email_address?.split('@')[0]}
                  </span>
                  {featuredLookbook.verification_badge && (
                    <span className="ml-2">
                      {featuredLookbook.verification_badge === 'verified' && '✓'}
                      {featuredLookbook.verification_badge === 'gold' && '⭐'}
                      {featuredLookbook.verification_badge === 'diamond' && '💎'}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xl mb-8 text-gray-200 max-w-xl">
                  {featuredLookbook.bio || 'Discover this amazing lookbook with curated style recommendations and outfit inspirations.'}
                </p>

                {/* Stats */}
                <div className="flex items-center space-x-6 mb-8 text-lg">
                  <div className="flex items-center">
                    <span className="mr-2">❤️</span>
                    <span>{featuredLookbook.likes_count || 0} likes</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">👁️</span>
                    <span>{featuredLookbook.views_count || 0} views</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleView(featuredLookbook.id)}
                    className="bg-white text-black px-8 py-3 rounded-lg font-bold text-lg flex items-center hover:bg-gray-200 transition-colors"
                  >
                    <PlayIcon className="w-6 h-6 mr-2" />
                    View Lookbook
                  </button>
                  <button
                    onClick={() => userLikes.includes(parseInt(featuredLookbook.id)) ? handleUnlike(featuredLookbook.id) : handleLike(featuredLookbook.id)}
                    className="bg-gray-600/80 text-white px-8 py-3 rounded-lg font-bold text-lg flex items-center hover:bg-gray-600 transition-colors"
                  >
                    {userLikes.includes(parseInt(featuredLookbook.id)) ? '❤️' : '🤍'}
                    <span className="ml-2">
                      {userLikes.includes(parseInt(featuredLookbook.id)) ? 'Liked' : 'Like'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accordion Sections */}
      <div className="container mx-auto px-4 sm:px-8 py-8 space-y-6">
        {categories.map((category) => {
          const categoryLookbooks = getLookbooksByCategory(category.id);
          const isOpen = openAccordions.has(category.id);
          
          if (categoryLookbooks.length === 0) return null;

          return (
            <div key={category.id} className="border-b border-gray-800 bg-gray-900/30 backdrop-blur-sm">
              {/* Accordion Header */}
              <button
                onClick={() => toggleAccordion(category.id)}
                className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="text-left">
                    <h2 className="text-lg sm:text-xl font-bold text-white">{category.name}</h2>
                    <p className="text-gray-400 text-xs sm:text-sm">{category.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Scroll Controls - only show when open */}
                  {isOpen && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          scroll(category.id, 'left');
                        }}
                        className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                      >
                        <ChevronLeftIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          scroll(category.id, 'right');
                        }}
                        className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                      >
                        <ChevronRightIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  
                  {/* Chevron indicator */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
              </button>

              {/* Accordion Content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 pb-6">
                      {/* Horizontal Scroll Container */}
                      <div className="relative">
                        <div
                          ref={(el) => scrollRefs.current[category.id] = el}
                          className="flex space-x-3 sm:space-x-4 overflow-x-auto scrollbar-hide pb-4"
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                          {categoryLookbooks.map((lookbook) => {
                            return (
                            <div key={lookbook.id} className="flex-none w-64 sm:w-72">
                              <div className="relative w-full h-96 sm:h-[420px]">
                                <EnhancedLookBookCard
                                  id={lookbook.id}
                                  imageUrl={(() => {
                                    if (lookbook.outfits) {
                                      try {
                                        const characterData = JSON.parse(lookbook.outfits);
                                        return characterData.image || '/assets/logo.png';
                                      } catch (e) {
                                        return '/assets/logo.png';
                                      }
                                    }
                                    return '/assets/logo.png';
                                  })()}
                                  heading={lookbook.name}
                                  backgroundColor={lookbook.color}
                                  avatarSticker={(() => {
                                    return '/assets/logo.png'; // Fallback for now
                                  })()}
                                  customAvatarUrl={lookbook.custom_avatar_url}
                                  creatorName={lookbook.users_updated?.email_address?.split('@')[0] || 'User'}
                                  creatorType={lookbook.creator_type || 'user'}
                                  verificationBadge={lookbook.verification_badge}
                                  likesCount={lookbook.likes_count || 0}
                                  viewsCount={lookbook.views_count || 0}
                                  isLiked={userLikes.includes(parseInt(lookbook.id))}
                                  isPremium={Boolean(lookbook.is_premium)}
                                  priceTier={lookbook.price_tier || 'free'}
                                  bio={lookbook.bio}
                                  socialLinks={lookbook.social_links ? JSON.parse(lookbook.social_links) : {}}
                                  onView={() => handleView(lookbook.id)}
                                  onLike={() => handleLike(lookbook.id)}
                                  onUnlike={() => handleUnlike(lookbook.id)}
                                  onShare={() => handleShare(lookbook)}
                                  {...(isAdmin ? {onEnhancedEdit: () => handleEnhancedEdit(lookbook)} : {})}
                                  currentUserId={user?.id}
                                  creatorId={lookbook.user_id}
                                  totalEngagementScore={lookbook.total_engagement_score || 0}
                                />
                              </div>
                            </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Custom scrollbar hiding */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default NetflixStyleExplore;