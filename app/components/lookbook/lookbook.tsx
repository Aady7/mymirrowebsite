"use client";

import LookBookBanner from "./lookbookbanner";
import { useEffect, useState, useRef } from "react";
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
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  
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
        visibility: 1, // Default to public, you can make this configurable// Store character data as JSON
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

  //to handle card expansion/collapse
  const handleCardClick = (cardId: string) => {
    if (expandedCardId === cardId) {
      setExpandedCardId(null); // Collapse if already expanded
    } else {
      setExpandedCardId(cardId); // Expand the clicked card
    }
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
    <>
      <LookBookBanner />

      {/* Error display */}
      {error && (
        <div className="px-5 mt-[-45px] mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="px-5 mt-[-45px] mb-4">
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            <span className="block sm:inline">Loading...</span>
          </div>
        </div>
      )}

             {/* card section */}
       <div 
         className="px-5 mt-[-45px]"
         style={{
           marginBottom: lookbook.length > 0 ? `${Math.max(8, 40 - lookbook.length * 4)}px` : '32px'
         }}
       >
        {/* Heading */}
        <h1 className="text-[25px] text-black font-bold tracking-wider uppercase">
          Your Lookbook
        </h1>

                 {/* Card Container (Stack) */}
         <div 
           className="relative mt-20"
           style={{
             // Calculate height dynamically based on expanded state
             minHeight: lookbook.length > 0 
               ? expandedCardId 
                 ? `${520 + (lookbook.length - 1) * 100}px` // More space when expanded
                 : `${420 + (lookbook.length - 1) * 160}px` // Normal stacking
               : 'auto'
           }}
         >
          {lookbook.length === 0 ? (
            <div className="px-4 mt-10 flex flex-col items-center justify-center">
              <Image
                src="/assets/lookbookEmpty.svg"
                alt="Empty"
                width={100}
                height={100}
                className="w-full h-full"
              />
              <h1 className="mt-10 pl-2 text-center align-center uppercase text-black text-md font-semibold">
                Looks like your Lookbook’s on vacation 👀 Time to add some fire
                fits!
              </h1>
            </div>
          ) : null}
                                          {lookbook.map((card, idx) => {
            const isExpanded = expandedCardId === card.id;
            const isOtherExpanded = expandedCardId !== null && expandedCardId !== card.id;
            
            return (
              <div
                key={card.id}
                className={`relative transition-all duration-500 ease-in-out cursor-pointer hover:shadow-2xl`}
                style={{
                  marginTop: isExpanded 
                    ? 0 // Expanded card moves to natural position
                    : isOtherExpanded 
                      ? (idx === 0 ? 0 : -280) // Other cards become more hidden when one is expanded
                      : (idx === 0 ? 0 : -220), // Normal stacking
                  zIndex: isExpanded 
                    ? 1000 // Expanded card goes to top
                    : isOtherExpanded 
                      ? idx // Other cards maintain their order but lower z-index
                      : idx + 1, // Normal z-index
                  transform: isExpanded 
                    ? `translateY(0px) scale(1.02)` // Expanded card: no offset, slightly larger
                    : isOtherExpanded
                      ? `translateY(${idx * 8}px) scale(0.95)` // Other cards: smaller and more compressed
                      : `translateY(${idx * 12}px)`, // Normal offset
                  opacity: isOtherExpanded ? 0.6 : 1, // Dim other cards when one is expanded
                }}
                onClick={() => handleCardClick(card.id)}
              >
                <LookBookCard
                  imageUrl={card.characterImage}
                  heading={card.title}
                  backgroundColor={card.color || getColorByIndex(idx)}
                  avatarSticker={card.avatarStickerUrl}
                  onEdit={() => handleEdit(idx)}
                  onShare={() => handleShare(card)}
                  onDelete={() => {
                    setDeleteTarget(card);
                    setShowDeleteModal(true);
                  }}
                />
              </div>
            );
          })}

                     {/* Add New Card Button - positioned beneath the newest card */}
           <div
             className="relative"
             style={{
               marginTop: lookbook.length > 0 
                 ? expandedCardId 
                   ? -30 // Less margin when expanded
                   : -50 // Normal margin
                 : 0,
               zIndex: lookbook.length + 10, // Higher than all cards
               width: "100%",
               height: "80px",
             }}
           >
             <button
               onClick={() => setPopup(true)}
               className="absolute bottom-2 right-4 w-16 h-16 bg-white rounded-full border-2 border-gray-400 shadow-xl flex items-center justify-center text-3xl font-bold hover:scale-105 transition pointer-events-auto"
             >
               +
             </button>
           </div>
        </div>
      </div>

      {/* to the slide up popup menu for adding the cards */}
      {showPopup && (
        <div className="fixed inset-0  bg-opacity-60 z-50 flex items-end justify-center">
          <div className="bg-black w-full max-w-md rounded-t-2xl p-6 text-white animate-slide-up">
            <button
              className="text-white text-3xl mb-2"
              onClick={() => setPopup(false)}
            >
              &times;
            </button>

            <div className="px-4 w-full h-50 bg-black rounded-xl mb-6">
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

            <p className="text-xs text-gray-300 mb-6 px-8">
              Here's how your cover looks right now. Wanna make it so you?
            </p>
            <div className="flex items-center justify-center">
                             <Button className="text-sm bg-gray-100 text-black rounded-md px-4 py-2 mb-6"
                 onClick={async () => {
                   // First create the lookbook, then open edit
                   const currentLength = lookbook.length;
                   await handleAddNewCard();
                   // The new card will be at index = currentLength (since we add to end)
                   setEditIndex(currentLength);
                   setShowEditLookBook(true);
                 }}
                 disabled={!name.trim()}
               >
                Create Your Own Cover
              </Button>
            </div>

            <div className="mb-4 mt-6 px-8">
              <label className="text-sm font-semibold">
                Name Your Lookbook
              </label>
              <p className="text-[10px] text-gray-400 mb-3">
                Give your Lookbook a name that screams your vibe.
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border-b border-white focus:outline-none py-2 text-white"
                placeholder=""
              />
            </div>

            <div className="flex items-center justify-center mt-10 ">
              <Button
                onClick={handleAddNewCard}
                disabled={isLoading || !name.trim()}
                className={`text-sm uppercase bg-gray-100 text-black rounded-md px-4 py-2 mb-2 w-25 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Saving...' : 'save'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showEditLookBook && editIndex !== null && lookbook[editIndex] && (
        <EditLookBook 
          item={lookbook[editIndex]} 
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
              <span className="font-semibold">{deleteTarget.title}?</span>
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
                  await handleDelete(deleteTarget.id);
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default LookBook;
