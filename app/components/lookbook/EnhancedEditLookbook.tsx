"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface EnhancedEditLookbookProps {
  lookbook: {
    id: string;
    title: string;
    customAvatarUrl?: string;
    creatorType?: 'user' | 'influencer' | 'celebrity';
    verificationBadge?: 'verified' | 'gold' | 'diamond' | null;
    isPremium?: boolean;
    priceTier?: 'free' | 'premium' | 'exclusive';
    bio?: string;
    socialLinks?: { instagram?: string; tiktok?: string; youtube?: string };
    featuredUntil?: string;
  };
  onClose: () => void;
  onSave: () => void;
}

const EnhancedEditLookbook: React.FC<EnhancedEditLookbookProps> = ({
  lookbook,
  onClose,
  onSave
}) => {
  // Form state
  const [formData, setFormData] = useState({
    customAvatarUrl: lookbook.customAvatarUrl || '',
    creatorType: lookbook.creatorType || 'user' as 'user' | 'influencer' | 'celebrity',
    verificationBadge: lookbook.verificationBadge || null as 'verified' | 'gold' | 'diamond' | null,
    isPremium: lookbook.isPremium || false,
    priceTier: lookbook.priceTier || 'free' as 'free' | 'premium' | 'exclusive',
    bio: lookbook.bio || '',
    socialLinks: {
      instagram: lookbook.socialLinks?.instagram || '',
      tiktok: lookbook.socialLinks?.tiktok || '',
      youtube: lookbook.socialLinks?.youtube || ''
    },
    featuredUntil: lookbook.featuredUntil || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'premium' | 'social' | 'featured'>('profile');

  // Handle form updates
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateSocialLink = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  // Handle custom avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${lookbook.id}-avatar-${Date.now()}.${fileExt}`;
      
      // Try to upload to storage bucket
      const { data, error } = await supabase.storage
        .from('lookbook-avatars')
        .upload(fileName, file);

      if (error) {
        // If bucket doesn't exist, create it or handle gracefully
        if (error.message.includes('Bucket not found')) {
          setError('Storage bucket not configured. Please contact support.');
          return;
        }
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('lookbook-avatars')
        .getPublicUrl(fileName);

      updateField('customAvatarUrl', publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  // Save changes
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const updateData = {
        custom_avatar_url: formData.customAvatarUrl || null,
        creator_type: formData.creatorType,
        verification_badge: formData.verificationBadge,
        is_premium: formData.isPremium,
        price_tier: formData.priceTier,
        bio: formData.bio || null,
        social_links: JSON.stringify(formData.socialLinks),
        featured_until: formData.featuredUntil || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('lookbook')
        .update(updateData)
        .eq('id', lookbook.id);

      if (error) throw error;

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving lookbook:', error);
      setError('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'premium', label: 'Premium', icon: '⭐' },
    { id: 'social', label: 'Social', icon: '🔗' },
    { id: 'featured', label: 'Featured', icon: '🔥' }
  ];

  const verificationOptions = [
    { value: null, label: 'None', description: 'No verification badge' },
    { value: 'verified', label: 'Verified ✓', description: 'Blue checkmark verification' },
    { value: 'gold', label: 'Gold ⭐', description: 'Gold verification for influencers' },
    { value: 'diamond', label: 'Diamond 💎', description: 'Diamond verification for celebrities' }
  ];

  const creatorTypeOptions = [
    { value: 'user', label: 'User', description: 'Regular user account' },
    { value: 'influencer', label: 'Influencer', description: 'Social media influencer' },
    { value: 'celebrity', label: 'Celebrity', description: 'Celebrity or public figure' }
  ];

  const priceTierOptions = [
    { value: 'free', label: 'Free', description: 'Free to view' },
    { value: 'premium', label: 'Premium', description: 'Premium content' },
    { value: 'exclusive', label: 'Exclusive', description: 'Exclusive access only' }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Advanced Lookbook Editor
                </h2>
                <p className="text-blue-100 mt-1">✨ {lookbook.title}</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-500 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2 text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto bg-white">
            <style jsx>{`
              /* Custom scrollbar for modal content */
              div::-webkit-scrollbar {
                width: 8px;
              }
              div::-webkit-scrollbar-track {
                background: rgba(229, 231, 235, 0.5);
                border-radius: 4px;
              }
              div::-webkit-scrollbar-thumb {
                background: rgba(59, 130, 246, 0.6);
                border-radius: 4px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: rgba(59, 130, 246, 0.8);
              }
            `}</style>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Avatar
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {formData.customAvatarUrl ? (
                        <Image
                          src={formData.customAvatarUrl}
                          alt="Avatar"
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 text-2xl">📷</span>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Upload Photo
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Upload a custom profile photo
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creator Type
                  </label>
                  <div className="space-y-2">
                    {creatorTypeOptions.map((option) => (
                      <label key={option.value} className="flex items-center p-3 border rounded-lg bg-white border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="creatorType"
                          value={option.value}
                          checked={formData.creatorType === option.value}
                          onChange={(e) => updateField('creatorType', e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Badge
                  </label>
                  <div className="space-y-2">
                    {verificationOptions.map((option) => (
                      <label key={option.value || 'none'} className="flex items-center p-3 border rounded-lg bg-white border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="verificationBadge"
                          value={option.value || ''}
                          checked={formData.verificationBadge === option.value}
                          onChange={(e) => updateField('verificationBadge', e.target.value || null)}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                    placeholder="Tell people about yourself..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>
            )}

            {/* Premium Tab */}
            {activeTab === 'premium' && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.isPremium}
                      onChange={(e) => updateField('isPremium', e.target.checked)}
                      className="w-5 h-5 text-purple-600"
                    />
                    <div>
                      <div className="font-medium">Premium Lookbook</div>
                      <div className="text-sm text-gray-600">Make this a premium lookbook</div>
                    </div>
                  </label>
                </div>

                {formData.isPremium && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Tier
                    </label>
                    <div className="space-y-2">
                      {priceTierOptions.map((option) => (
                        <label key={option.value} className="flex items-center p-3 border rounded-lg bg-white border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="priceTier"
                            value={option.value}
                            checked={formData.priceTier === option.value}
                            onChange={(e) => updateField('priceTier', e.target.value)}
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Social Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                      @
                    </span>
                    <input
                      type="text"
                      value={formData.socialLinks.instagram}
                      onChange={(e) => updateSocialLink('instagram', e.target.value)}
                      placeholder="username"
                      className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TikTok
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                      @
                    </span>
                    <input
                      type="text"
                      value={formData.socialLinks.tiktok}
                      onChange={(e) => updateSocialLink('tiktok', e.target.value)}
                      placeholder="username"
                      className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                      @
                    </span>
                    <input
                      type="text"
                      value={formData.socialLinks.youtube}
                      onChange={(e) => updateSocialLink('youtube', e.target.value)}
                      placeholder="channel"
                      className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Featured Tab */}
            {activeTab === 'featured' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Until
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.featuredUntil}
                    onChange={(e) => updateField('featuredUntil', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Set when this lookbook should stop being featured
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Featured Benefits</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Appears in featured section on explore page</li>
                    <li>• Higher visibility in search results</li>
                    <li>• Special featured badge on lookbook card</li>
                    <li>• Priority in recommendation algorithms</li>
                  </ul>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 flex items-center shadow-lg"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedEditLookbook;