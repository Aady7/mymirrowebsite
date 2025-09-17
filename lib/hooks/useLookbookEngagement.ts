import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LookbookLike, LookbookView } from '@/app/types/lookbook';

interface EngagementHookProps {
  lookbookId: number;
  userId?: string;
}

interface EngagementData {
  likesCount: number;
  viewsCount: number;
  isLiked: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useLookbookEngagement = ({ lookbookId, userId }: EngagementHookProps) => {
  const [data, setData] = useState<EngagementData>({
    likesCount: 0,
    viewsCount: 0,
    isLiked: false,
    isLoading: true,
    error: null
  });

  // Fetch initial engagement data
  useEffect(() => {
    fetchEngagementData();
  }, [lookbookId, userId]);

  const fetchEngagementData = async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      // Get lookbook with engagement counts
      const { data: lookbook, error: lookbookError } = await supabase
        .from('lookbook')
        .select('likes_count, views_count')
        .eq('id', lookbookId)
        .single();

      if (lookbookError) {
        throw lookbookError;
      }

      let isLiked = false;

      // Check if user has liked this lookbook
      if (userId) {
        const { data: likeData, error: likeError } = await supabase
          .from('lookbook_likes')
          .select('id')
          .eq('lookbook_id', lookbookId)
          .eq('user_id', userId)
          .maybeSingle();

        if (likeError && likeError.code !== 'PGRST116') {
          console.error('Error checking like status:', likeError);
        } else {
          isLiked = !!likeData;
        }
      }

      setData({
        likesCount: lookbook.likes_count || 0,
        viewsCount: lookbook.views_count || 0,
        isLiked,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching engagement data:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch engagement data'
      }));
    }
  };

  const toggleLike = async (): Promise<boolean> => {
    if (!userId) {
      console.warn('User must be logged in to like lookbooks');
      return false;
    }

    try {
      if (data.isLiked) {
        // Unlike
        const { error } = await supabase
          .from('lookbook_likes')
          .delete()
          .eq('lookbook_id', lookbookId)
          .eq('user_id', userId);

        if (error) throw error;

        setData(prev => ({
          ...prev,
          isLiked: false,
          likesCount: Math.max(0, prev.likesCount - 1)
        }));

      } else {
        // Like
        const { error } = await supabase
          .from('lookbook_likes')
          .insert([{
            lookbook_id: lookbookId,
            user_id: userId
          }]);

        if (error) throw error;

        setData(prev => ({
          ...prev,
          isLiked: true,
          likesCount: prev.likesCount + 1
        }));
      }

      return true;
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  };

  const recordView = async (viewDuration: number = 0): Promise<boolean> => {
    try {
      // Get user's IP address for anonymous view tracking
      const ipResponse = await fetch('/api/get-ip');
      const { ip } = await ipResponse.json();

      const viewData: any = {
        lookbook_id: lookbookId,
        view_duration: viewDuration,
        ip_address: ip
      };

      // Add user_id if available
      if (userId) {
        viewData.user_id = userId;
      }

      const { error } = await supabase
        .from('lookbook_views')
        .insert([viewData]);

      if (error) {
        // If it's a duplicate view (same user/IP same day), that's okay
        if (error.code === '23505') {
          return true;
        }
        throw error;
      }

      // Update local views count
      setData(prev => ({
        ...prev,
        viewsCount: prev.viewsCount + 1
      }));

      return true;
    } catch (error) {
      console.error('Error recording view:', error);
      return false;
    }
  };

  return {
    ...data,
    toggleLike,
    recordView,
    refresh: fetchEngagementData
  };
};

// Utility hook for fetching trending/popular lookbooks
export const useTrendingLookbooks = (limit: number = 10) => {
  const [lookbooks, setLookbooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrendingLookbooks();
  }, [limit]);

  const fetchTrendingLookbooks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('lookbook')
        .select(`
          *,
          users_updated!inner(user_id, email_address)
        `)
        .eq('visibility', 1) // Only public lookbooks
        .order('total_engagement_score', { ascending: false })
        .limit(limit);

      if (fetchError) throw fetchError;

      setLookbooks(data || []);
    } catch (error) {
      console.error('Error fetching trending lookbooks:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch trending lookbooks');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookbooks,
    isLoading,
    error,
    refresh: fetchTrendingLookbooks
  };
};

// Hook for managing creator profiles
export const useCreatorProfile = (userId: string) => {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalLookbooks: 0,
    totalLikes: 0,
    totalViews: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchCreatorProfile();
    }
  }, [userId]);

  const fetchCreatorProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('users_updated')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      // Get aggregated stats
      const { data: statsData, error: statsError } = await supabase
        .from('lookbook')
        .select('likes_count, views_count')
        .eq('user_id', userId)
        .eq('visibility', 1); // Only public lookbooks

      if (statsError) throw statsError;

      const totalLookbooks = statsData?.length || 0;
      const totalLikes = statsData?.reduce((sum, book) => sum + (book.likes_count || 0), 0) || 0;
      const totalViews = statsData?.reduce((sum, book) => sum + (book.views_count || 0), 0) || 0;

      setProfile(userProfile);
      setStats({
        totalLookbooks,
        totalLikes,
        totalViews
      });

    } catch (error) {
      console.error('Error fetching creator profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch creator profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      const { error } = await supabase
        .from('users_updated')
        .update(updates)
        .eq('user_id', userId);

      if (error) throw error;

      setProfile(prev => ({ ...prev, ...updates }));
      return true;
    } catch (error) {
      console.error('Error updating creator profile:', error);
      return false;
    }
  };

  return {
    profile,
    stats,
    isLoading,
    error,
    updateProfile,
    refresh: fetchCreatorProfile
  };
};