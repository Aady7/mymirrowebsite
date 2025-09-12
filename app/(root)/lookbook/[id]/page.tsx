"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LookBookCard from "@/app/components/look-book/lookBooklookCard";
import LookBookOutfit from "@/app/components/look-book/lookBookOutfit";
import LookBookProduct from "@/app/components/look-book/lookBookProduct";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/hooks/useAuth";

interface LookbookData {
  id: string;
  user_id: string;
  name: string;
  color: string;
  avatar: string;
  visibility: number; // 0 = private, 1 = public
  outfits: string | null; // JSON string of outfit IDs
  products: string | null; // JSON string of product IDs
  shareUrl: string | null;
  created_at: string;
}

interface OutfitData {
  id: string;
  name: string;
  image: string;
  // Add more fields as needed from your outfit data structure
}

interface ProductData {
  id: string;
  name: string;
  image: string;
  brand?: string;
  price?: string;
  affiliateUrl?: string;
}

const LookbookPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { getSession } = useAuth();
  const [lookbookData, setLookbookData] = useState<LookbookData | null>(null);
  const [outfitsData, setOutfitsData] = useState<OutfitData[]>([]);
  const [productsData, setProductsData] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchLookbookData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user session
        const session = await getSession();
        const currentUserId = session?.user?.id;

        // Fetch lookbook data from Supabase
        const { data: lookbook, error: lookbookError } = await supabase
          .from('lookbook')
          .select('*')
          .eq('id', id)
          .single();

        if (lookbookError) {
          throw new Error(lookbookError.message);
        }

        if (!lookbook) {
          setError('Lookbook not found');
          setLoading(false);
          return;
        }

        // Check if lookbook is private and user is not the owner
        if (lookbook.visibility === 0 && lookbook.user_id !== currentUserId) {
          setError('This lookbook is private');
          setLoading(false);
          return;
        }

        setLookbookData(lookbook);
        setIsOwner(lookbook.user_id === currentUserId);

        // Fetch outfits data if outfit IDs exist
        if (lookbook.outfits) {
          try {
            const outfitIds = JSON.parse(lookbook.outfits);
            if (outfitIds && outfitIds.length > 0) {
              // You'll need to implement this based on your outfit data structure
              // For now, we'll use dummy data
              setOutfitsData([
                {
                  id: "outfit-1",
                  name: "URBAN SHIFT",
                  image: "/assets/pant-22.png"
                },
                {
                  id: "outfit-2", 
                  name: "STREET STYLE",
                  image: "/assets/shooes.png"
                }
              ]);
            }
          } catch (e) {
            console.error('Error parsing outfits JSON:', e);
          }
        }

        // Fetch products data if product IDs exist
        if (lookbook.products) {
          try {
            const productIds = JSON.parse(lookbook.products);
            if (productIds && productIds.length > 0) {
              // You'll need to implement this based on your product data structure
              // For now, we'll use dummy data
              setProductsData([
                {
                  id: "product-1",
                  name: "Glitchez Vivid Edge Shirt",
                  image: "/assets/tex-2.png",
                  brand: "Glitchez",
                  price: "$29.99"
                },
                {
                  id: "product-2", 
                  name: "Kook N Keech Trousers",
                  image: "/assets/pant-22.png",
                  brand: "Kook N Keech",
                  price: "$49.99"
                }
              ]);
            }
          } catch (e) {
            console.error('Error parsing products JSON:', e);
          }
        }

        setLoading(false);
        
      } catch (error: any) {
        console.error("Error fetching lookbook data:", error);
        setError(error.message || 'Failed to load lookbook');
        setLoading(false);
      }
    };

    if (id) {
      fetchLookbookData();
    }
  }, [id, getSession]);

  const handleEdit = () => {
    router.push(`/lookbook/${id}/edit`);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this lookbook?")) {
      // In a real app, you would call your delete API
      console.log("Deleting lookbook:", id);
      router.push("/lookbook");
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/lookbook/${id}`;
    if (navigator.share) {
      navigator.share({
        title: lookbookData?.name || "My Lookbook",
        url: shareUrl,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert("Share link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your lookbook...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !lookbookData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {error || 'Lookbook not found'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error === 'This lookbook is private' 
              ? 'This lookbook is set to private and you don\'t have access to view it.'
              : 'The lookbook you\'re looking for doesn\'t exist or has been removed.'
            }
          </p>
          <button 
            onClick={() => router.push("/lookbook")}
            className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 tracking-wide"
          >
            Back to Lookbooks
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with Privacy Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/lookbook")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Lookbooks
            </button>
            {lookbookData.visibility === 0 && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Private
              </span>
            )}
            {lookbookData.visibility === 1 && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Public
              </span>
            )}
          </div>
          {isOwner && (
            <button
              onClick={() => router.push(`/lookbook/${id}/edit`)}
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Edit Lookbook
            </button>
          )}
        </motion.div>

        {/* Main LookBook Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 flex justify-center"
        >
          <div className="w-full max-w-sm">
            <LookBookCard
              imageUrl={lookbookData.avatar}
              heading={lookbookData.name}
              backgroundColor={lookbookData.color}
              avatarSticker={lookbookData.avatar}
              onEdit={isOwner ? handleEdit : undefined}
              onDelete={isOwner ? handleDelete : undefined}
              onShare={handleShare}
            />
          </div>
        </motion.div>

        {/* Outfits Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">OUTFITS</h2>
          {outfitsData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {outfitsData.map((outfit) => (
                <motion.div
                  key={outfit.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <LookBookOutfit
                    leftImageUrl={outfit.image}
                    rightImageUrl={outfit.image}
                    outfitName={outfit.name}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👗</div>
              <p className="text-gray-600 text-lg">No outfits added yet</p>
              <p className="text-gray-500">Start adding outfits to build your lookbook!</p>
            </div>
          )}
        </motion.div>

        {/* Products Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">PRODUCTS</h2>
          {productsData.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {productsData.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <LookBookProduct
                    productImageUrl={product.image}
                    productUrl={product.affiliateUrl || `#`}
                    productId={product.id}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🛍️</div>
              <p className="text-gray-600 text-lg">No products added yet</p>
              <p className="text-gray-500">Add products to showcase your style preferences!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LookbookPage;