"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCreatorProfile } from '@/lib/hooks/useLookbookEngagement';
import { SocialLinks } from '@/app/types/lookbook';
import { supabase } from '@/lib/supabase';

interface CreatorDashboardProps {
  userId: string;
  isOwnProfile?: boolean;
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ 
  userId, 
  isOwnProfile = false 
}) => {
  const { profile, stats, isLoading, error, updateProfile } = useCreatorProfile(userId);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      updateProfile(editData);
    } else {
      // Start editing
      setEditData({
        bio: profile?.bio || '',
        creator_type: profile?.creator_type || 'user',
        social_links: profile?.social_links ? JSON.parse(profile.social_links) : {}
      });
    }
    setIsEditing(!isEditing);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    
    try {
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('lookbook-avatars')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('lookbook-avatars')
        .getPublicUrl(fileName);

      // Update profile
      await updateProfile({ custom_avatar_url: publicUrl });
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const getBadgeInfo = (badge: string | null) => {
    const badges = {
      verified: { icon: '✓', color: 'bg-blue-500', label: 'Verified Creator' },
      gold: { icon: '★', color: 'bg-yellow-500', label: 'Gold Creator' },
      diamond: { icon: '💎', color: 'bg-purple-500', label: 'Diamond Creator' }
    };
    return badge ? badges[badge] : null;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Failed to load creator profile</p>
      </div>
    );
  }

  const badgeInfo = getBadgeInfo(profile.verification_badge);
  const socialLinks: SocialLinks = profile.social_links ? JSON.parse(profile.social_links) : {};

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        {/* Avatar Section */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 relative">
            {profile.custom_avatar_url ? (
              <Image
                src={profile.custom_avatar_url}
                alt="Creator Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold">
                {profile.email_address?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            
            {/* Verification Badge */}
            {badgeInfo && (
              <div 
                className={`absolute -top-2 -right-2 w-8 h-8 ${badgeInfo.color} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg`}
                title={badgeInfo.label}
              >
                {badgeInfo.icon}
              </div>
            )}
          </div>

          {/* Upload Avatar Button (only for own profile) */}
          {isOwnProfile && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-800">
              {profile.email_address?.split('@')[0] || 'Creator'}
            </h1>
            {profile.creator_type !== 'user' && (
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                {profile.creator_type}
              </span>
            )}
          </div>

          {/* Bio Section */}
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.textarea
                key="edit-bio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                value={editData.bio}
                onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell people about yourself..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 mb-4"
              />
            ) : (
              <motion.p
                key="show-bio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-600 mb-4 max-w-md"
              >
                {profile.bio || "No bio available"}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Social Links */}
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            {socialLinks.instagram && (
              <a 
                href={`https://instagram.com/${socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            {socialLinks.tiktok && (
              <a 
                href={`https://tiktok.com/@${socialLinks.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.294-1.98-1.294-3.286V.6h-3.091v16.4c0 1.717-1.4 3.117-3.117 3.117s-3.117-1.4-3.117-3.117 1.4-3.117 3.117-3.117c.206 0 .407.02.6.057V10.6c-.193-.017-.389-.026-.6-.026C5.394 10.574 1.4 14.569 1.4 19.514S5.394 28.454 10.339 28.454s8.939-3.994 8.939-8.94V9.031a9.174 9.174 0 005.222 1.6V7.54a6.047 6.047 0 01-5.179-1.978z"/>
                </svg>
              </a>
            )}
            {socialLinks.youtube && (
              <a 
                href={`https://youtube.com/@${socialLinks.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
          </div>

          {/* Edit Button (only for own profile) */}
          {isOwnProfile && (
            <button
              onClick={handleEditToggle}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                isEditing 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white text-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-3xl font-bold mb-2">{formatNumber(stats.totalLookbooks)}</div>
          <div className="text-purple-100">Lookbooks</div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-6 text-white text-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-3xl font-bold mb-2">{formatNumber(stats.totalLikes)}</div>
          <div className="text-pink-100">Total Likes</div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white text-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-3xl font-bold mb-2">{formatNumber(stats.totalViews)}</div>
          <div className="text-blue-100">Total Views</div>
        </motion.div>
      </div>

      {/* Creator Type Upgrade Options (for own profile) */}
      {isOwnProfile && profile.creator_type === 'user' && (
        <motion.div 
          className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-2">🌟 Upgrade to Creator</h3>
          <p className="mb-4 text-yellow-100">
            Unlock premium features, verification badges, and enhanced visibility for your lookbooks!
          </p>
          <div className="flex gap-3">
            <button className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Become Influencer
            </button>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors">
              Learn More
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CreatorDashboard;