"use client";

import LookBookBanner from "./lookbookbanner";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { StyleQuizData } from "@/lib/hooks/useStyleQuizData";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import EditLookBook from "./editlookbook";
import { useRouter } from "next/navigation";
import { LookbookItem, LookbookRecord, CreateLookbookRequest } from "@/app/types/lookbook";
import { stickerMapping, getStickerByName, defaultSticker } from "@/app/data/stickerMapping";
import LookBookCard from "../look-book/lookBooklookCard";
import { Character } from "./character";

const LookBook = () => {
  const [lookbook, setLookbook] = useState<LookbookItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const { getSession } = useAuth();
  const [showPopup, setPopup] = useState(false);
  const [name, setName] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LookbookItem | null>(null);
  const router=useRouter();
  const [showEditLookBook, setShowEditLookBook] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Fetch existing lookbooks from Supabase
  const fetchLookbooks = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('lookbook')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Convert Supabase records to local LookbookItem format
      const lookbookItems: LookbookItem[] = data.map((record: LookbookRecord) => {
        const stickerData = getStickerByName(record.avatar || '') || defaultSticker;
        
        // Parse character data from outfits field, fallback to default
        let characterData = Character[0]; // Default character
        try {
          if (record.outfits) {
            characterData = JSON.parse(record.outfits);
          }
        } catch (e) {
          console.warn('Failed to parse character data:', e);
        }
        
        return {
          id: record.id!.toString(),
          title: record.name || 'Untitled',
          characterImage: characterData.image,
          characterData: characterData,
          color: record.color || undefined,
          visibility: record.visibility || undefined,
          shareUrl: record.shareUrl || undefined,
          avatarSticker: record.avatar || defaultSticker.name,
          avatarStickerUrl: stickerData.image,
        };
      });

      setLookbook(lookbookItems);
    } catch (error) {
      console.error('Error fetching lookbooks:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch lookbooks');
    } finally {
      setIsLoading(false);
    }
  };

  //chek the session id of the user
  useEffect(() => {
    const checkSession = async () => {
      const { session } = await getSession();
      if (session?.user) {
        setUser(session.user);
        // Fetch existing lookbooks when user is authenticated
        await fetchLookbooks(session.user.id);
      }
    };
    checkSession();
  }, [getSession]);

  //to add a new card
  const handleAddNewCard = async () => {
    if (!user || !name.trim()) {
      setError("Please make sure you're logged in and have entered a name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create the lookbook record for Supabase
      const defaultCharacter = Character[0];
      const lookbookData: CreateLookbookRequest = {
        user_id: user.id,
        name: name.trim(),
        color: getColorByIndex(lookbook.length), // Use the same color logic
        avatar: defaultSticker.name, // Store sticker name in database
        visibility: 0, // Default to private for security
        products: undefined, // Will be populated later as mentioned
        shareUrl: undefined, // Can be generated later if needed
      };

      // Insert into Supabase
      const { data, error: supabaseError } = await supabase
        .from('lookbook')
        .insert([lookbookData])
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Create local lookbook item for immediate UI update
      const newLook: LookbookItem = {
        id: data.id.toString(),
        title: name,
        characterImage: Character[0].image,
        characterData: Character[0],
        color: lookbookData.color || undefined,
        visibility: lookbookData.visibility || undefined,
        shareUrl: lookbookData.shareUrl || undefined,
        avatarSticker: defaultSticker.name,
        avatarStickerUrl: defaultSticker.image,
      };

             // Add new card to the end of array (appears at bottom of visual stack)
       setLookbook((prev) => [...prev, newLook]);
      setPopup(false);
      setName("");
    } catch (error) {
      console.error('Error creating lookbook:', error);
      setError(error instanceof Error ? error.message : 'Failed to create lookbook');
    } finally {
      setIsLoading(false);
    }
  };
  //to delete the card
  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Delete from Supabase
      const { error: supabaseError } = await supabase
        .from('lookbook')
        .delete()
        .eq('id', parseInt(id));

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Remove from local state
      setLookbook((prev) => prev.filter((card) => card.id !== id));
    } catch (error) {
      console.error('Error deleting lookbook:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete lookbook');
    } finally {
      setIsLoading(false);
    }
  };
  //to edit the card
  const handleEdit = (idx: number) => {
    console.log("Edit card with Index:", idx);
    setEditIndex(idx);
    setShowEditLookBook(true);
  };

  //to share the card
  const handleShare = (card: LookbookItem) => {
    if (card.shareUrl) {
      navigator.clipboard.writeText(card.shareUrl);
      // You can add a toast notification here
      console.log("Share URL copied to clipboard");
    } else {
      // Generate share URL if not exists
      const shareUrl = `${window.location.origin}/lookbook/shared/${card.id}`;
      navigator.clipboard.writeText(shareUrl);
      console.log("Share URL copied to clipboard");
    }
  };

  // Handle card navigation
  const goToNextCard = () => {
    if (currentCardIndex < lookbook.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const goToCard = (index: number) => {
    setCurrentCardIndex(index);
  };

  const handleViewLookbook = (lookbookId: string) => {
    router.push(`/lookbook/${lookbookId}`);
  };

  // Handle drag/swipe events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const threshold = 50;

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > threshold) {
        goToPrevCard();
      } else if (deltaX < -threshold) {
        goToNextCard();
      }
    } else {
      // Vertical swipe
      if (deltaY > threshold) {
        goToPrevCard();
      } else if (deltaY < -threshold) {
        goToNextCard();
      }
    }
    
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart({ 
      x: e.touches[0].clientX, 
      y: e.touches[0].clientY 
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.changedTouches[0].clientX - dragStart.x;
    const deltaY = e.changedTouches[0].clientY - dragStart.y;
    const threshold = 50;

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > threshold) {
        goToPrevCard();
      } else if (deltaX < -threshold) {
        goToNextCard();
      }
    } else {
      // Vertical swipe
      if (deltaY > threshold) {
        goToPrevCard();
      } else if (deltaY < -threshold) {
        goToNextCard();
      }
    }
    
    setIsDragging(false);
  };

  //to update lookbook data
  const handleUpdateLookbook = async (lookbookId: string, updatedData: {
    color: string;
    avatarSticker: string;
    title: string;
    selectedCharacter: any;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Update in Supabase
      const { error: supabaseError } = await supabase
        .from('lookbook')
        .update({
          name: updatedData.title,
          color: updatedData.color,
          avatar: updatedData.avatarSticker,
          
        })
        .eq('id', parseInt(lookbookId));

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Update local state
      const stickerData = getStickerByName(updatedData.avatarSticker) || defaultSticker;
      setLookbook((prev) =>
        prev.map((item) =>
          item.id === lookbookId
            ? {
                ...item,
                title: updatedData.title,
                color: updatedData.color,
                avatarSticker: updatedData.avatarSticker,
                avatarStickerUrl: stickerData.image,
                characterImage: updatedData.selectedCharacter.image,
                characterData: updatedData.selectedCharacter,
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating lookbook:', error);
      setError(error instanceof Error ? error.message : 'Failed to update lookbook');
    } finally {
      setIsLoading(false);
    }
  };

  function getColorByIndex(index: number) {
    const colors = ["#D4BA9E", "#F6EF6B", "#68C79C", "#B58DDC"]; // add more if needed
    return colors[index % colors.length];
  }

  return (
    <div className="min-h-screen bg-white">
      <LookBookBanner />

      {/* Error display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 md:px-6 lg:px-8 mt-4 mb-4"
        >
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 md:px-6 lg:px-8 mt-4 mb-4"
        >
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl">
            <span className="block sm:inline">Loading...</span>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="px-4 md:px-6 lg:px-8 mt-4 mb-8">
        {/* Heading with Add Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 flex items-center justify-between relative z-10"
        >
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-900 font-bold tracking-wide">
              Your Lookbook
            </h1>
            <p className="text-gray-600 mt-2">
              {lookbook.length > 0 
                ? `${lookbook.length} look${lookbook.length === 1 ? '' : 's'} saved`
                : 'Create your first look to get started'
              }
            </p>
          </div>
          
          {/* Add New Card Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => setPopup(true)}
            className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-full shadow-lg flex items-center justify-center text-xl md:text-2xl font-bold transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            +
          </motion.button>
        </motion.div>

        {/* Card Container - Stacked Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {lookbook.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center justify-center py-12 md:py-16"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 mb-6">
                <Image
                  src="/assets/lookbookEmpty.svg"
                  alt="Empty Lookbook"
                  width={128}
                  height={128}
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 text-center">
                Your Lookbook is Empty
              </h2>
              <p className="text-gray-600 text-center max-w-md px-4">
                Looks like your Lookbook's on vacation 👀 Time to add some fire fits!
              </p>
            </motion.div>
          ) : (
            <div className="relative">
              {/* Desktop: Horizontal Stacked Carousel */}
              <div className="hidden md:block">
                <div 
                  className="relative flex justify-center items-center h-96 cursor-grab select-none overflow-visible"
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="relative w-80 h-full">
                    {lookbook.map((card, idx) => {
                      const isActive = idx === currentCardIndex;
                      const offset = idx - currentCardIndex;
                      
                      return (
                        <motion.div
                          key={card.id}
                          className="absolute inset-0 cursor-pointer"
                          style={{
                            zIndex: lookbook.length - Math.abs(offset),
                          }}
                          animate={{
                            x: offset * 80, // Increased horizontal offset - show more of left cards
                            y: Math.abs(offset) * 8, // Reduced vertical offset
                            scale: isActive ? 1 : 0.85 - Math.abs(offset) * 0.03, // Less scale reduction
                            opacity: Math.abs(offset) > 3 ? 0 : 1 - Math.abs(offset) * 0.15, // Show more cards
                          }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 30 
                          }}
                          onClick={() => {
                            if (!isActive) {
                              goToCard(idx);
                            }
                          }}
                        >
                          <LookBookCard
                            imageUrl={card.characterImage}
                            heading={card.title}
                            backgroundColor={card.color || getColorByIndex(idx)}
                            avatarSticker={card.avatarStickerUrl}
                            onView={() => handleViewLookbook(card.id)}
                            onEdit={() => handleEdit(idx)}
                            onShare={() => handleShare(card)}
                            onDelete={() => {
                              setDeleteTarget(card);
                              setShowDeleteModal(true);
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Navigation arrows */}
                  {currentCardIndex > 0 && (
                    <button
                      onClick={goToPrevCard}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-50"
                    >
                      ←
                    </button>
                  )}
                  {currentCardIndex < lookbook.length - 1 && (
                    <button
                      onClick={goToNextCard}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-50"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile: Horizontal Stacked Carousel (Same as Desktop) */}
              <div className="md:hidden">
                <div 
                  className="relative flex justify-center items-center h-80 cursor-grab select-none overflow-hidden -mt-4"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="relative w-72 h-full">
                    {lookbook.map((card, idx) => {
                      const isActive = idx === currentCardIndex;
                      const offset = idx - currentCardIndex;
                      
                      return (
                        <motion.div
                          key={card.id}
                          className="absolute inset-0 cursor-pointer"
                          style={{
                            zIndex: lookbook.length - Math.abs(offset),
                          }}
                          animate={{
                            x: offset * 60, // Horizontal offset for mobile (slightly less than desktop)
                            y: Math.abs(offset) * 6, // Slight vertical offset
                            scale: isActive ? 1 : 0.85 - Math.abs(offset) * 0.03, // Same scaling as desktop
                            opacity: Math.abs(offset) > 3 ? 0 : 1 - Math.abs(offset) * 0.15, // Show up to 3 cards
                          }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 30 
                          }}
                          onClick={() => {
                            if (!isActive) {
                              goToCard(idx);
                            }
                          }}
                        >
                          <LookBookCard
                            imageUrl={card.characterImage}
                            heading={card.title}
                            backgroundColor={card.color || getColorByIndex(idx)}
                            avatarSticker={card.avatarStickerUrl}
                            onView={() => handleViewLookbook(card.id)}
                            onEdit={() => handleEdit(idx)}
                            onShare={() => handleShare(card)}
                            onDelete={() => {
                              setDeleteTarget(card);
                              setShowDeleteModal(true);
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Navigation indicators */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {lookbook.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToCard(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === currentCardIndex ? 'bg-gray-900' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Touch Navigation Areas (Invisible) */}
                  {currentCardIndex > 0 && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-16 cursor-pointer"
                      onClick={goToPrevCard}
                    />
                  )}
                  {currentCardIndex < lookbook.length - 1 && (
                    <div
                      className="absolute right-0 top-0 bottom-0 w-16 cursor-pointer"
                      onClick={goToNextCard}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add New Lookbook Popup */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setPopup(false);
            }
          }}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-md rounded-t-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Lookbook</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => setPopup(false)}
              >
                &times;
              </button>
            </div>

            <div className="px-4 w-full h-50 bg-gray-100 rounded-xl mb-6">
              <div 
                className="relative border-8 shadow-xl rounded-xl w-full h-[200px] overflow-hidden"
                style={{ backgroundColor: getColorByIndex(lookbook.length) }}
              >
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-40">
                  <div className="grid grid-cols-6 grid-rows-4 h-full w-full">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="border border-white/50"></div>
                    ))}
                  </div>
                </div>

                {/* White semicircle background */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-white rounded-t-full"></div>

                {/* Default Character Preview */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-24 z-20">
                  <Image
                    src={Character[0].image}
                    alt="Character Preview"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Default Stickers */}
                <div className="absolute top-4 left-4 w-6 h-6 z-10">
                  <Image
                    src={defaultSticker.image}
                    alt="Sticker"
                    fill
                    className="object-contain opacity-80"
                  />
                </div>
                <div className="absolute top-6 right-4 w-5 h-5 z-10">
                  <Image
                    src={defaultSticker.image}
                    alt="Sticker"
                    fill
                    className="object-contain opacity-60"
                  />
                </div>
                <div className="absolute bottom-12 left-3 w-6 h-6 z-10">
                  <Image
                    src={defaultSticker.image}
                    alt="Sticker"
                    fill
                    className="object-contain opacity-70"
                  />
                </div>

                {/* Title preview */}
                <div className="absolute top-2 left-4 right-4 z-30">
                  <h3 className="text-white font-bold text-xs uppercase truncate">
                    {name || "My Lookbook"}
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6 text-center">
              Here's how your cover looks right now. Wanna make it so you?
            </p>
            
            <div className="flex items-center justify-center mb-6">
              <Button 
                className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 tracking-wide"
                onClick={async () => {
                  const currentLength = lookbook.length;
                  await handleAddNewCard();
                  setEditIndex(currentLength);
                  setShowEditLookBook(true);
                }}
                disabled={!name.trim()}
              >
                Create Your Own Cover
              </Button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Name Your Lookbook
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Give your Lookbook a name that screams your vibe.
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                placeholder="Enter lookbook name..."
              />
            </div>

            <div className="flex items-center justify-center">
              <Button
                onClick={handleAddNewCard}
                disabled={isLoading || !name.trim()}
                className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Lookbook'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
      {showEditLookBook && editIndex !== null && lookbook[editIndex!] && (
        <EditLookBook 
          item={lookbook[editIndex!]!} 
          onClose={() => {
            setShowEditLookBook(false);
            setEditIndex(null);
          }}
          onSave={handleUpdateLookbook}
        />
      )}

      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-60">
          <div className="bg-[#232323] rounded-xl p-6 w-[320px] text-center scale-90 animate-scale-in">
            <h2 className="text-lg font-bold text-white mb-2">Delete lookbook?</h2>
            <p className="text-sm text-gray-200 mb-6">
              Are you sure you want to delete <br />
              <span className="font-semibold">{deleteTarget?.title}?</span>
            </p>
            <div className="flex border-t border-gray-700 pt-4 gap-4 justify-between">
              <button
                className="flex-1 text-blue-400 font-semibold py-2 rounded hover:bg-gray-800 transition"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 text-red-400 font-semibold py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
                disabled={isLoading}
                onClick={async () => {
                  if (deleteTarget) {
                    await handleDelete(deleteTarget.id);
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  }
                }}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default LookBook;
