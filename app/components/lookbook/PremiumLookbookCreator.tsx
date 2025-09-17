"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Character } from './character';
import { stickerMapping, getStickerByName, defaultSticker } from '@/app/data/stickerMapping';
import { CreateLookbookRequest } from '@/app/types/lookbook';

interface PremiumLookbookCreatorProps {
  userId: string;
  onClose: () => void;
  onSuccess: (lookbook: any) => void;
  userType?: 'user' | 'influencer' | 'celebrity';
}

interface CreationStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

const PremiumLookbookCreator: React.FC<PremiumLookbookCreatorProps> = ({
  userId,
  onClose,
  onSuccess,
  userType = 'user'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingCustomAvatar, setUploadingCustomAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    color: '#B58CD2',
    selectedCharacter: Character[0],
    selectedSticker: defaultSticker,
    customAvatarUrl: '',
    bio: '',
    socialLinks: {
      instagram: '',
      tiktok: '',
      youtube: ''
    },
    visibility: 1, // public by default for premium
    isPremium: userType !== 'user',
    priceTier: userType === 'celebrity' ? 'exclusive' : userType === 'influencer' ? 'premium' : 'free'
  });

  const handleCustomAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCustomAvatar(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('lookbook-avatars')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('lookbook-avatars')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, customAvatarUrl: publicUrl }));
      
    } catch (error) {
      console.error('Error uploading custom avatar:', error);
    } finally {
      setUploadingCustomAvatar(false);
    }
  };

  const handleCreateLookbook = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a lookbook name');
      return;
    }

    setIsCreating(true);

    try {
      const lookbookData: CreateLookbookRequest = {
        user_id: userId,
        name: formData.name,
        color: formData.color,
        avatar: formData.selectedSticker.name,
        custom_avatar_url: formData.customAvatarUrl || null,
        visibility: formData.visibility,
        outfits: JSON.stringify(formData.selectedCharacter),
        is_premium: formData.isPremium,
        creator_type: userType,
        bio: formData.bio || null,
        social_links: JSON.stringify(formData.socialLinks),
        price_tier: formData.priceTier,
        shareUrl: `lookbook-${Date.now()}`
      };

      const { data, error } = await supabase
        .from('lookbook')
        .insert([lookbookData])
        .select()
        .single();

      if (error) throw error;

      onSuccess(data);
      onClose();
    } catch (error) {
      console.error('Error creating lookbook:', error);
      alert('Failed to create lookbook. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const steps: CreationStep[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Name your lookbook and choose its style',
      component: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lookbook Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter a catchy name for your lookbook"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Theme
            </label>
            <div className="flex gap-3 flex-wrap">
              {[
                '#B58CD2', '#FF6B9D', '#4ECDC4', '#45B7D1', 
                '#96CEB4', '#FCEAA7', '#FF7675', '#A29BFE'
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-12 h-12 rounded-full border-4 transition-all ${
                    formData.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {userType !== 'user' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio / Description
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell people about this lookbook and your style..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          )}
        </div>
      )
    },
    {
      id: 'avatar',
      title: 'Avatar Selection',
      description: 'Choose or upload your lookbook avatar',
      component: (
        <div className="space-y-6">
          {/* Custom Avatar Upload for Premium Users */}
          {userType !== 'user' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Custom Avatar (Premium Feature)
              </label>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100">
                    {formData.customAvatarUrl ? (
                      <Image
                        src={formData.customAvatarUrl}
                        alt="Custom Avatar"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {uploadingCustomAvatar && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingCustomAvatar}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    {uploadingCustomAvatar ? 'Uploading...' : 'Upload Photo'}
                  </button>
                  <p className="text-sm text-gray-500 mt-1">Recommended: 400x400px, under 5MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCustomAvatarUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="text-center text-gray-500 my-4">OR</div>
            </div>
          )}

          {/* Character Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Choose Character
            </label>
            <div className="grid grid-cols-3 gap-4">
              {Character.map((character, index) => (
                <motion.button
                  key={index}
                  onClick={() => setFormData(prev => ({ ...prev, selectedCharacter: character }))}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    formData.selectedCharacter === character
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-16 h-16 mx-auto mb-2">
                    <Image
                      src={character.image}
                      alt={`Character ${index + 1}`}
                      width={64}
                      height={64}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  {formData.selectedCharacter === character && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sticker Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Decorative Stickers
            </label>
            <div className="grid grid-cols-4 gap-3">
              {stickerMapping.map((sticker) => (
                <motion.button
                  key={sticker.name}
                  onClick={() => setFormData(prev => ({ ...prev, selectedSticker: sticker }))}
                  className={`relative p-3 rounded-lg border-2 transition-all ${
                    formData.selectedSticker.name === sticker.name
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 mx-auto">
                    <Image
                      src={sticker.image}
                      alt={sticker.name}
                      width={32}
                      height={32}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  {formData.selectedSticker.name === sticker.name && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'social',
      title: 'Social & Settings',
      description: 'Add social links and configure privacy',
      component: (
        <div className="space-y-6">
          {/* Social Links for Premium Users */}
          {userType !== 'user' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Social Media Links (Optional)
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                    }))}
                    placeholder="Instagram username"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.294-1.98-1.294-3.286V.6h-3.091v16.4c0 1.717-1.4 3.117-3.117 3.117s-3.117-1.4-3.117-3.117 1.4-3.117 3.117-3.117c.206 0 .407.02.6.057V10.6c-.193-.017-.389-.026-.6-.026C5.394 10.574 1.4 14.569 1.4 19.514S5.394 28.454 10.339 28.454s8.939-3.994 8.939-8.94V9.031a9.174 9.174 0 005.222 1.6V7.54a6.047 6.047 0 01-5.179-1.978z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={formData.socialLinks.tiktok}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, tiktok: e.target.value }
                    }))}
                    placeholder="TikTok username"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                    }))}
                    placeholder="YouTube channel"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Privacy Settings
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="visibility"
                  value={1}
                  checked={formData.visibility === 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, visibility: parseInt(e.target.value) }))}
                  className="text-purple-500"
                />
                <div>
                  <div className="font-medium">Public</div>
                  <div className="text-sm text-gray-500">Anyone can view and discover your lookbook</div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="visibility"
                  value={0}
                  checked={formData.visibility === 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, visibility: parseInt(e.target.value) }))}
                  className="text-purple-500"
                />
                <div>
                  <div className="font-medium">Private</div>
                  <div className="text-sm text-gray-500">Only you can view this lookbook</div>
                </div>
              </label>
            </div>
          </div>

          {/* Premium Features Info */}
          {userType !== 'user' && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900 mb-1">Premium Features Enabled</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Custom avatar upload</li>
                    <li>• Social media integration</li>
                    <li>• Enhanced visibility</li>
                    <li>• Creator verification badge</li>
                    <li>• Priority in search results</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Create Premium Lookbook</h2>
              <p className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[50vh] overflow-y-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-gray-600">
                {currentStepData.description}
              </p>
            </div>
            
            {currentStepData.component}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-purple-500' 
                    : index < currentStep 
                    ? 'bg-purple-300' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreateLookbook}
              disabled={isCreating || !formData.name.trim()}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create Lookbook
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumLookbookCreator;