"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/hooks/useAuth';

interface LookbookOption {
  id: string;
  name: string;
  color: string;
  avatar: string;
  hasProduct?: boolean; // Whether this lookbook already contains the product
  products?: string | null; // Raw products JSON
  outfits?: string | null; // Raw outfits JSON
}

interface AddToLookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemType: 'outfit' | 'product';
  onSuccess?: () => void;
}

const AddToLookbookModal: React.FC<AddToLookbookModalProps> = ({
  isOpen,
  onClose,
  itemId,
  itemType,
  onSuccess
}) => {
  const { getSession } = useAuth();
  const [lookbooks, setLookbooks] = useState<LookbookOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLookbookName, setNewLookbookName] = useState('');
  const [selectedLookbooks, setSelectedLookbooks] = useState<string[]>([]);

  useEffect(() => {
    console.log('🔄 AddToLookbookModal: Modal state changed. isOpen:', isOpen);
    if (isOpen) {
      fetchUserLookbooks();
    }
  }, [isOpen]);

  const fetchUserLookbooks = async () => {
    try {
      setLoading(true);
      
      // Try both methods to get the session
      const sessionResult = await getSession();
      const { data: { session: directSession } } = await supabase.auth.getSession();
      
      console.log('🔍 AddToLookbookModal: Session debug:', {
        sessionResult,
        directSession,
        sessionResultType: typeof sessionResult,
        directSessionType: typeof directSession,
        sessionUser: sessionResult?.session?.user,
        directUser: directSession?.user,
        userFromResult: sessionResult?.session?.user?.id,
        userFromDirect: directSession?.user?.id
      });
      
      // Try different ways to access the user ID
      const userId = sessionResult?.session?.user?.id || 
                     directSession?.user?.id || 
                     sessionResult?.user?.id;
      
      if (!userId) {
        console.warn('⚠️ AddToLookbookModal: No user session found');
        return;
      }
      
      console.log('✅ AddToLookbookModal: Using user ID:', userId);

      const { data, error } = await supabase
        .from('lookbook')
        .select('id, name, color, avatar, created_at, products, outfits')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      console.log('📊 AddToLookbookModal: Lookbooks query result:', { data, error, count: data?.length });

      if (error) throw error;
      
      // Process lookbooks to check if they already contain the current item
      const processedLookbooks = (data || []).map(lookbook => {
        let hasProduct = false;
        
        try {
          if (itemType === 'product' && lookbook.products) {
            const existingProducts = JSON.parse(lookbook.products);
            hasProduct = existingProducts.includes(itemId);
          } else if (itemType === 'outfit' && lookbook.outfits) {
            const existingOutfits = JSON.parse(lookbook.outfits);
            hasProduct = existingOutfits.includes(itemId);
          }
        } catch (e) {
          console.warn('Error parsing lookbook data:', e);
        }
        
        return {
          ...lookbook,
          hasProduct
        };
      });
      
      console.log('✅ Processed lookbooks with duplicate check:', processedLookbooks);
      setLookbooks(processedLookbooks);
    } catch (error) {
      console.error('❌ AddToLookbookModal: Error fetching lookbooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewLookbook = async () => {
    try {
      if (!newLookbookName.trim()) {
        console.warn('⚠️ AddToLookbookModal: No lookbook name provided');
        return;
      }
      
      setLoading(true);
      
      // Try both methods to get the session
      const sessionResult = await getSession();
      const { data: { session: directSession } } = await supabase.auth.getSession();
      
      // Try different ways to access the user ID
      const userId = sessionResult?.session?.user?.id || 
                     directSession?.user?.id || 
                     sessionResult?.user?.id;
      
      console.log('🔍 AddToLookbookModal: Creating lookbook for user:', userId, 'with name:', newLookbookName);
      
      if (!userId) {
        console.warn('⚠️ AddToLookbookModal: No user session found for creation');
        return;
      }

      const newLookbook = {
        user_id: userId,
        name: newLookbookName,
        color: '#B58CD2', // Default color
        avatar: '/assets/stickers/image_1.svg', // Default avatar
        visibility: 0, // Private by default
        outfits: itemType === 'outfit' ? JSON.stringify([itemId]) : null,
        products: itemType === 'product' ? JSON.stringify([itemId]) : null,
      };

      console.log('📝 AddToLookbookModal: Inserting lookbook data:', newLookbook);

      const { data, error } = await supabase
        .from('lookbook')
        .insert([newLookbook])
        .select();

      console.log('📊 AddToLookbookModal: Insert result:', { data, error });

      if (error) throw error;

      setNewLookbookName('');
      setIsAddingNew(false);
      fetchUserLookbooks();
      onSuccess?.();
      
    } catch (error) {
      console.error('❌ AddToLookbookModal: Error creating lookbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToExistingLookbook = async (lookbookId: string) => {
    try {
      setLoading(true);
      
      // First, get the current lookbook data
      const { data: lookbook, error: fetchError } = await supabase
        .from('lookbook')
        .select('outfits, products')
        .eq('id', lookbookId)
        .single();

      if (fetchError) throw fetchError;

      let updateData: any = {};

      if (itemType === 'outfit') {
        const currentOutfits = lookbook.outfits ? JSON.parse(lookbook.outfits) : [];
        if (!currentOutfits.includes(itemId)) {
          currentOutfits.push(itemId);
          updateData.outfits = JSON.stringify(currentOutfits);
        } else {
          console.log('⚠️ Outfit already exists in lookbook');
          return; // Don't update if already exists
        }
      } else {
        const currentProducts = lookbook.products ? JSON.parse(lookbook.products) : [];
        if (!currentProducts.includes(itemId)) {
          currentProducts.push(itemId);
          updateData.products = JSON.stringify(currentProducts);
        } else {
          console.log('⚠️ Product already exists in lookbook');
          return; // Don't update if already exists
        }
      }

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('lookbook')
          .update(updateData)
          .eq('id', lookbookId);

        if (updateError) throw updateError;
        onSuccess?.();
      }

    } catch (error) {
      console.error('Error adding to lookbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLookbookSelect = (lookbookId: string) => {
    addToExistingLookbook(lookbookId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-md rounded-t-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Add to Lookbook
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl"
                onClick={onClose}
              >
                &times;
              </button>
            </div>

            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            )}

            {!loading && (
              <>
                {/* Create New Lookbook */}
                {!isAddingNew ? (
                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="w-full mb-4 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800"
                  >
                    <span className="text-2xl">+</span>
                    <span>Create New Lookbook</span>
                  </button>
                ) : (
                  <div className="mb-4 p-4 border border-gray-200 rounded-xl">
                    <input
                      type="text"
                      placeholder="Enter lookbook name..."
                      value={newLookbookName}
                      onChange={(e) => setNewLookbookName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={createNewLookbook}
                        disabled={!newLookbookName.trim()}
                        className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingNew(false);
                          setNewLookbookName('');
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing Lookbooks */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Your Lookbooks ({lookbooks.length})
                  </h3>
                  
                  {lookbooks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No lookbooks found.</p>
                      <p className="text-sm">Create your first one above!</p>
                    </div>
                  ) : (
                    lookbooks.map((lookbook) => (
                      <motion.button
                        key={lookbook.id}
                        onClick={() => lookbook.hasProduct ? null : handleLookbookSelect(lookbook.id)}
                        disabled={lookbook.hasProduct}
                        className={`w-full p-3 border rounded-lg transition-colors flex items-center gap-3 ${
                          lookbook.hasProduct 
                            ? 'border-green-200 bg-green-50 cursor-not-allowed opacity-75' 
                            : 'border-gray-200 hover:bg-gray-50 cursor-pointer'
                        }`}
                        whileHover={lookbook.hasProduct ? {} : { scale: 1.02 }}
                        whileTap={lookbook.hasProduct ? {} : { scale: 0.98 }}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg"
                          style={{ backgroundColor: lookbook.color }}
                        />
                        <span className="flex-1 text-left font-medium text-gray-900">
                          {lookbook.name}
                        </span>
                        {lookbook.hasProduct ? (
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Added
                          </div>
                        ) : (
                          <span className="text-gray-400">→</span>
                        )}
                      </motion.button>
                    ))
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddToLookbookModal;
