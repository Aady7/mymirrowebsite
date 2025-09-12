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
    if (isOpen) {
      fetchUserLookbooks();
    }
  }, [isOpen]);

  const fetchUserLookbooks = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('lookbook')
        .select('id, name, color, avatar')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLookbooks(data || []);
    } catch (error) {
      console.error('Error fetching lookbooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewLookbook = async () => {
    try {
      if (!newLookbookName.trim()) return;
      
      setLoading(true);
      const session = await getSession();
      if (!session?.user?.id) return;

      const newLookbook = {
        user_id: session.user.id,
        name: newLookbookName,
        color: '#B58CD2', // Default color
        avatar: '/assets/stickers/image_1.svg', // Default avatar
        visibility: 0, // Private by default
        outfits: itemType === 'outfit' ? JSON.stringify([itemId]) : null,
        products: itemType === 'product' ? JSON.stringify([itemId]) : null,
      };

      const { error } = await supabase
        .from('lookbook')
        .insert([newLookbook]);

      if (error) throw error;

      setNewLookbookName('');
      setIsAddingNew(false);
      fetchUserLookbooks();
      onSuccess?.();
      
    } catch (error) {
      console.error('Error creating lookbook:', error);
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
        }
      } else {
        const currentProducts = lookbook.products ? JSON.parse(lookbook.products) : [];
        if (!currentProducts.includes(itemId)) {
          currentProducts.push(itemId);
          updateData.products = JSON.stringify(currentProducts);
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
                      <p>No lookbooks yet.</p>
                      <p className="text-sm">Create your first one above!</p>
                    </div>
                  ) : (
                    lookbooks.map((lookbook) => (
                      <motion.button
                        key={lookbook.id}
                        onClick={() => handleLookbookSelect(lookbook.id)}
                        className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg"
                          style={{ backgroundColor: lookbook.color }}
                        />
                        <span className="flex-1 text-left font-medium text-gray-900">
                          {lookbook.name}
                        </span>
                        <span className="text-gray-400">→</span>
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
